from flask import Blueprint, request, jsonify
from functools import wraps
from datetime import datetime

import jwt
import os

from app import db
from app.models.admin import Admin
from app.models.investor import Investor
from app.models.project import Project
from app.models.referral import Referral
from app.models.lead import Lead


admin_bp = Blueprint("admin", __name__)


# =========================================================
# ADMIN AUTHENTICATION
# =========================================================

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "status": "error",
                "message": "Authorization token is required."
            }), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({
                "status": "error",
                "message": "Invalid authorization format."
            }), 401

        token = auth_header.split(" ", 1)[1]

        try:
            secret_key = os.getenv(
                "JWT_SECRET_KEY",
                "journey-fire-secret-change-this"
            )

            decoded = jwt.decode(
                token,
                secret_key,
                algorithms=["HS256"]
            )

            admin_id = decoded.get("admin_id")

            if not admin_id:
                return jsonify({
                    "status": "error",
                    "message": "Invalid token."
                }), 401

            admin = Admin.query.get(admin_id)

            if not admin:
                return jsonify({
                    "status": "error",
                    "message": "Admin account not found."
                }), 401

            if not admin.is_active:
                return jsonify({
                    "status": "error",
                    "message": "Admin account is inactive."
                }), 403

            return f(admin, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({
                "status": "error",
                "message": "Session has expired. Please login again."
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "status": "error",
                "message": "Invalid authentication token."
            }), 401

        except Exception as e:
            print("Authentication error:", e)

            return jsonify({
                "status": "error",
                "message": "Authentication failed."
            }), 401

    return decorated_function


# =========================================================
# CURRENT ADMIN
# =========================================================

@admin_bp.route("/me", methods=["GET"])
@admin_required
def current_admin(admin):

    return jsonify({
        "status": "success",
        "admin": admin.to_dict()
    }), 200


# =========================================================
# DASHBOARD STATISTICS
# =========================================================

@admin_bp.route("/dashboard", methods=["GET"])
@admin_required
def dashboard(admin):

    total_investors = Investor.query.count()

    total_leads = Lead.query.count()

    new_leads = Lead.query.filter_by(
        status="new"
    ).count()

    assigned_leads = Lead.query.filter(
        Lead.assigned_admin_id.isnot(None)
    ).count()

    total_referrals = Referral.query.count()

    active_admins = Admin.query.filter_by(
        is_active=True
    ).count()

    contacted_leads = Lead.query.filter_by(
        status="contacted"
    ).count()

    interested_leads = Lead.query.filter_by(
        status="interested"
    ).count()

    follow_up_leads = Lead.query.filter_by(
        status="follow-up"
    ).count()

    converted_leads = Lead.query.filter_by(
        status="converted"
    ).count()

    lost_leads = Lead.query.filter_by(
        status="lost"
    ).count()

    return jsonify({
        "status": "success",

        "stats": {
            "total_investors": total_investors,
            "total_leads": total_leads,
            "new_leads": new_leads,
            "assigned_leads": assigned_leads,
            "total_referrals": total_referrals,
            "active_admins": active_admins,

            "contacted_leads": contacted_leads,
            "interested_leads": interested_leads,
            "follow_up_leads": follow_up_leads,
            "converted_leads": converted_leads,
            "lost_leads": lost_leads
        }
    }), 200


# =========================================================
# ALL LEADS
# =========================================================

@admin_bp.route("/leads", methods=["GET"])
@admin_required
def get_leads(admin):

    leads = (
        Lead.query
        .order_by(Lead.created_at.desc())
        .all()
    )

    results = []

    for lead in leads:

        investor = lead.investor
        project = lead.project
        assigned_admin = lead.assigned_admin
        referral = lead.referral

        lead_data = {
            "id": lead.id,

            "status": lead.status,

            "notes": lead.notes,

            "created_at": (
                lead.created_at.isoformat()
                if lead.created_at
                else None
            ),

            "updated_at": (
                lead.updated_at.isoformat()
                if lead.updated_at
                else None
            ),

            "investor": None,

            "project": None,

            "assigned_admin": None,

            "referral": None
        }

        # -------------------------------------------------
        # INVESTOR
        # -------------------------------------------------

        if investor:

            lead_data["investor"] = {
                "id": investor.id,
                "full_name": investor.full_name,
                "phone": investor.phone,
                "email": investor.email,
                "location": investor.location,
                "budget": investor.budget,
                "payment_plan": investor.payment_plan,
                "project_id": investor.project_id,

                "created_at": (
                    investor.created_at.isoformat()
                    if investor.created_at
                    else None
                )
            }

        # -------------------------------------------------
        # PROJECT
        # -------------------------------------------------

        if project:

            lead_data["project"] = {
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "is_active": project.is_active
            }

        # -------------------------------------------------
        # ASSIGNED ADMIN
        # -------------------------------------------------

        if assigned_admin:

            lead_data["assigned_admin"] = {
                "id": assigned_admin.id,
                "name": assigned_admin.name,
                "email": assigned_admin.email,
                "phone": assigned_admin.phone
            }

        # -------------------------------------------------
        # REFERRAL
        # -------------------------------------------------

        if referral:

            lead_data["referral"] = {
                "id": referral.id,
                "name": referral.name,
                "phone": referral.phone,
                "email": referral.email,
                "relationship": referral.relationship,

                "referrer": (
                    {
                        "id": referral.referrer.id,
                        "name": referral.referrer.full_name,
                        "phone": referral.referrer.phone
                    }
                    if referral.referrer
                    else None
                )
            }

        results.append(lead_data)

    return jsonify({
        "status": "success",
        "count": len(results),
        "leads": results
    }), 200


# =========================================================
# ALL INVESTORS
# =========================================================

@admin_bp.route("/investors", methods=["GET"])
@admin_required
def get_investors(admin):

    investors = (
        Investor.query
        .order_by(Investor.created_at.desc())
        .all()
    )

    results = []

    for investor in investors:

        investor_data = investor.to_dict()

        investor_data["project"] = (
            investor.project.to_dict()
            if investor.project
            else None
        )

        investor_data["referrals"] = [
            referral.to_dict()
            for referral in investor.referrals
        ]

        investor_data["leads"] = [
            {
                "id": lead.id,
                "status": lead.status,
                "assigned_admin_id": lead.assigned_admin_id
            }
            for lead in investor.leads
        ]

        results.append(investor_data)

    return jsonify({
        "status": "success",
        "count": len(results),
        "investors": results
    }), 200


# =========================================================
# ALL REFERRALS
# =========================================================

@admin_bp.route("/referrals", methods=["GET"])
@admin_required
def get_referrals(admin):

    referrals = (
        Referral.query
        .order_by(Referral.created_at.desc())
        .all()
    )

    results = []

    for referral in referrals:

        results.append({
            "id": referral.id,
            "name": referral.name,
            "phone": referral.phone,
            "email": referral.email,
            "relationship": referral.relationship,

            "created_at": (
                referral.created_at.isoformat()
                if referral.created_at
                else None
            ),

            "referrer": (
                {
                    "id": referral.referrer.id,
                    "name": referral.referrer.full_name,
                    "phone": referral.referrer.phone,
                    "email": referral.referrer.email
                }
                if referral.referrer
                else None
            )
        })

    return jsonify({
        "status": "success",
        "count": len(results),
        "referrals": results
    }), 200


# =========================================================
# ADMIN TEAM
# =========================================================

@admin_bp.route("/team", methods=["GET"])
@admin_required
def get_team(admin):

    admins = (
        Admin.query
        .order_by(Admin.id.asc())
        .all()
    )

    return jsonify({
        "status": "success",
        "count": len(admins),
        "admins": [
            admin.to_dict()
            for admin in admins
        ]
    }), 200


# =========================================================
# UPDATE LEAD
# =========================================================

@admin_bp.route("/leads/<int:lead_id>", methods=["PUT"])
@admin_required
def update_lead(admin, lead_id):

    lead = Lead.query.get(lead_id)

    if not lead:

        return jsonify({
            "status": "error",
            "message": "Lead not found."
        }), 404

    data = request.get_json() or {}

    allowed_statuses = [
        "new",
        "contacted",
        "interested",
        "follow-up",
        "converted",
        "lost"
    ]

    # -----------------------------------------------------
    # STATUS
    # -----------------------------------------------------

    if "status" in data:

        status = data["status"]

        if status not in allowed_statuses:

            return jsonify({
                "status": "error",
                "message": "Invalid lead status."
            }), 400

        lead.status = status

    # -----------------------------------------------------
    # NOTES
    # -----------------------------------------------------

    if "notes" in data:

        lead.notes = data["notes"]

    # -----------------------------------------------------
    # ASSIGNED ADMIN
    # -----------------------------------------------------

    if "assigned_admin_id" in data:

        assigned_admin_id = data["assigned_admin_id"]

        if assigned_admin_id is None:

            lead.assigned_admin_id = None

        else:

            assigned_admin = Admin.query.get(
                assigned_admin_id
            )

            if not assigned_admin:

                return jsonify({
                    "status": "error",
                    "message": "Admin not found."
                }), 404

            if not assigned_admin.is_active:

                return jsonify({
                    "status": "error",
                    "message": "Cannot assign lead to an inactive admin."
                }), 400

            lead.assigned_admin_id = assigned_admin.id

    lead.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Lead updated successfully.",
        "lead": lead.to_dict()
    }), 200