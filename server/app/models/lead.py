from datetime import datetime

from app import db


class Lead(db.Model):
    __tablename__ = "leads"

    id = db.Column(db.Integer, primary_key=True)

    investor_id = db.Column(
        db.Integer,
        db.ForeignKey("investors.id"),
        nullable=True
    )

    referral_id = db.Column(
        db.Integer,
        db.ForeignKey("referrals.id"),
        nullable=True
    )

    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id"),
        nullable=False
    )

    assigned_admin_id = db.Column(
        db.Integer,
        db.ForeignKey("admins.id"),
        nullable=True
    )

    status = db.Column(
        db.String(50),
        default="new",
        nullable=False
    )

    notes = db.Column(
        db.Text,
        nullable=True
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

    # Relationships
    investor = db.relationship(
        "Investor",
        back_populates="leads"
    )

    referral = db.relationship(
        "Referral",
        back_populates="leads"
    )

    project = db.relationship(
        "Project",
        back_populates="leads"
    )

    assigned_admin = db.relationship(
        "Admin",
        back_populates="leads"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "investor_id": self.investor_id,
            "referral_id": self.referral_id,
            "project_id": self.project_id,
            "assigned_admin_id": self.assigned_admin_id,
            "status": self.status,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }