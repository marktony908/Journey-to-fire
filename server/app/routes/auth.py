from flask import Blueprint, request, jsonify
from app.models.admin import Admin
import jwt
from datetime import datetime, timedelta
from app import db
import os


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request body is required."
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email and password are required."
        }), 400

    admin = Admin.query.filter_by(email=email).first()

    if not admin:
        return jsonify({
            "status": "error",
            "message": "Invalid email or password."
        }), 401

    if not admin.is_active:
        return jsonify({
            "status": "error",
            "message": "This admin account is inactive."
        }), 403

    if not admin.check_password(password):
        return jsonify({
            "status": "error",
            "message": "Invalid email or password."
        }), 401

    secret_key = os.getenv(
        "JWT_SECRET_KEY",
        "journey-fire-secret-change-this"
    )

    token = jwt.encode(
        {
            "admin_id": admin.id,
            "email": admin.email,
            "exp": datetime.utcnow() + timedelta(hours=24)
        },
        secret_key,
        algorithm="HS256"
    )

    return jsonify({
        "status": "success",
        "message": "Login successful.",
        "token": token,
        "admin": admin.to_dict()
    }), 200