from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        os.getenv(
            "DATABASE_URL",
            "postgresql://journey_user:journey_password@localhost:5432/journey_fire"
        )
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY",
        "journey-fire-secret-change-this"
    )

    db.init_app(app)
    migrate.init_app(app, db)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "http://localhost:5173"
            }
        }
    )

    # Import models so SQLAlchemy knows about them
    from app.models import (
        Admin,
        Project,
        Investor,
        Referral,
        Lead,
    )

    # Import routes
    from app.routes.investors import investors_bp
    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp

    # Register routes
    app.register_blueprint(
        investors_bp,
        url_prefix="/api/investors"
    )

    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    app.register_blueprint(
        admin_bp,
        url_prefix="/api/admin"
    )

    return app