from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash

from app import db


class Admin(db.Model):
    __tablename__ = "admins"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(120),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False,
        index=True
    )

    phone = db.Column(
        db.String(30),
        nullable=True
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    # -----------------------------------------------------
    # ADMIN ROLE
    # -----------------------------------------------------

    role = db.Column(
        db.String(30),
        default="admin",
        nullable=False
    )

    # -----------------------------------------------------
    # MASTER ADMIN
    # -----------------------------------------------------

    is_master = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    # -----------------------------------------------------
    # ACCOUNT STATUS
    # -----------------------------------------------------

    is_active = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    leads = db.relationship(
        "Lead",
        back_populates="assigned_admin",
        lazy=True
    )

    # =====================================================
    # PASSWORD
    # =====================================================

    def set_password(self, password):
        self.password_hash = generate_password_hash(
            password
        )

    def check_password(self, password):
        return check_password_hash(
            self.password_hash,
            password
        )

    # =====================================================
    # SERIALIZE
    # =====================================================

    def to_dict(self):

        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "is_master": self.is_master,
            "is_active": self.is_active,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else None
            )
        }