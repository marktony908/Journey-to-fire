from flask import Blueprint, jsonify, request

from app import db
from app.models.investor import Investor
from app.models.project import Project
from app.models.referral import Referral
from app.models.lead import Lead
from app.services.lead_distribution import assign_lead


investors_bp = Blueprint(
    "investors",
    __name__
)


@investors_bp.route("/test", methods=["GET"])
def test_investors():
    return jsonify({
        "status": "success",
        "message": "Investor API is working 🔥"
    })


@investors_bp.route("/", methods=["POST"])
def create_investor():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No data provided."
        }), 400

    # Required fields
    full_name = data.get("fullName")
    phone = data.get("phone")
    project_value = data.get("project")

    if not full_name or not phone or not project_value:
        return jsonify({
            "status": "error",
            "message": "Full name, phone number and project are required."
        }), 400

    try:
        # Find the selected project
        project = Project.query.filter_by(
            name=project_value
        ).first()

        # Allow frontend values such as project-1
        if not project:
            project_number = {
                "project-1": "Tsavo Project 1",
                "project-2": "Tsavo Project 2",
                "project-3": "Tsavo Project 3",
                "project-4": "Tsavo Project 4",
                "not-sure": "I'm not sure yet"
            }.get(project_value)

            if project_number:
                project = Project.query.filter_by(
                    name=project_number
                ).first()

        # Create project automatically if it doesn't exist yet
        if not project:
            project_name = {
                "project-1": "Tsavo Project 1",
                "project-2": "Tsavo Project 2",
                "project-3": "Tsavo Project 3",
                "project-4": "Tsavo Project 4",
                "not-sure": "I'm not sure yet"
            }.get(project_value, project_value)

            project = Project(
                name=project_name,
                description=None,
                is_active=True
            )

            db.session.add(project)
            db.session.flush()

        # Create investor
        investor = Investor(
            full_name=full_name,
            phone=phone,
            email=data.get("email"),
            location=data.get("location"),
            budget=data.get("budget"),
            payment_plan=data.get("paymentPlan"),
            project_id=project.id
        )

        db.session.add(investor)
        db.session.flush()

        # Create the main investor lead
        lead = Lead(
            investor_id=investor.id,
            project_id=project.id,
            status="new"
        )

        db.session.add(lead)
        db.session.flush()

        # Automatically assign the lead
        assigned_admin = assign_lead(lead)

        # Handle referral
        referral = None
        referral_lead = None

        referral_name = data.get("referralName")
        referral_phone = data.get("referralPhone")

        if referral_name and referral_phone:

            referral = Referral(
                referrer_id=investor.id,
                name=referral_name,
                phone=referral_phone,
                email=data.get("referralEmail"),
                relationship=data.get("referralRelationship")
            )

            db.session.add(referral)
            db.session.flush()

            # Create a lead for the referred person
            referral_lead = Lead(
                referral_id=referral.id,
                project_id=project.id,
                status="new"
            )

            db.session.add(referral_lead)
            db.session.flush()

            # Assign referral to the next admin
            assign_lead(referral_lead)

        db.session.commit()

    except Exception:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "An error occurred while registering investor."
        }), 500

    return jsonify({
        "status": "success",
        "message": "Investor successfully registered.",
        "investor": investor.to_dict(),
        "lead": lead.to_dict(),
        "assigned_admin": (
            assigned_admin.to_dict()
            if assigned_admin
            else None
        ),
        "referral": (
            referral.to_dict()
            if referral
            else None
        ),
        "referral_lead": (
            referral_lead.to_dict()
            if referral_lead
            else None
        )
    }), 201