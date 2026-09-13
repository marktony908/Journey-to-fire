from app import db
from app.models.admin import Admin
from app.models.lead import Lead


def assign_lead(lead):
    """
    Assign a lead to the next active admin using round-robin distribution.
    """

    # Get all active admins
    active_admins = (
        Admin.query
        .filter_by(is_active=True)
        .order_by(Admin.id.asc())
        .all()
    )

    if not active_admins:
        return None

    # Get the most recently assigned lead
    last_lead = (
        Lead.query
        .filter(Lead.assigned_admin_id.isnot(None))
        .order_by(Lead.created_at.desc())
        .first()
    )

    # No previous assignment
    if last_lead is None:
        selected_admin = active_admins[0]

    else:
        # Find the position of the previous admin
        previous_admin_index = next(
            (
                index
                for index, admin in enumerate(active_admins)
                if admin.id == last_lead.assigned_admin_id
            ),
            None
        )

        # Previous admin is no longer active
        if previous_admin_index is None:
            selected_admin = active_admins[0]

        else:
            next_index = (
                previous_admin_index + 1
            ) % len(active_admins)

            selected_admin = active_admins[next_index]

    # Assign the lead (don't commit here; caller should commit)
    lead.assigned_admin_id = selected_admin.id

    return selected_admin