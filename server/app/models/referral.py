from datetime import datetime

from app import db


class Referral(db.Model):
    __tablename__ = "referrals"

    id = db.Column(db.Integer, primary_key=True)

    referrer_id = db.Column(
        db.Integer,
        db.ForeignKey("investors.id"),
        nullable=False
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    phone = db.Column(
        db.String(30),
        nullable=False
    )

    email = db.Column(
        db.String(150),
        nullable=True
    )

    relationship = db.Column(
        db.String(100),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # Relationships
    referrer = db.relationship(
        "Investor",
        back_populates="referrals"
    )

    leads = db.relationship(
        "Lead",
        back_populates="referral",
        lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "referrer_id": self.referrer_id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "relationship": self.relationship,
            "created_at": self.created_at.isoformat(),
        }