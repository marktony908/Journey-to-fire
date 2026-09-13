from datetime import datetime

from app import db


class Investor(db.Model):
    __tablename__ = "investors"

    id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(
        db.String(150),
        nullable=False
    )

    phone = db.Column(
        db.String(30),
        nullable=False,
        index=True
    )

    email = db.Column(
        db.String(150),
        nullable=True,
        index=True
    )

    location = db.Column(
        db.String(150),
        nullable=True
    )

    budget = db.Column(
        db.String(100),
        nullable=True
    )

    payment_plan = db.Column(
        db.String(100),
        nullable=True
    )

    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # Relationships
    project = db.relationship(
        "Project",
        back_populates="investors"
    )

    leads = db.relationship(
        "Lead",
        back_populates="investor",
        lazy=True
    )

    referrals = db.relationship(
        "Referral",
        back_populates="referrer",
        lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "phone": self.phone,
            "email": self.email,
            "location": self.location,
            "budget": self.budget,
            "payment_plan": self.payment_plan,
            "project_id": self.project_id,
            "created_at": self.created_at.isoformat(),
        }