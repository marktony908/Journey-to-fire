from app import create_app, db
from app.models.admin import Admin

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        email = "admin@journeytofire.com"
        existing = Admin.query.filter_by(email=email).first()
        output_path = "scripts/seed_admin_output.txt"
        if existing:
            msg = f"Admin already exists: id={existing.id}, email={existing.email}\n"
            print(msg)
            with open(output_path, "w") as fh:
                fh.write(msg)
        else:
            admin = Admin(
                name="System Admin",
                email=email,
                phone="+254700000000",
                is_active=True,
            )
            admin.set_password("Admin@123")
            db.session.add(admin)
            db.session.commit()
            msg = f"Created admin: id={admin.id}, email={admin.email}\n"
            print(msg)
            with open(output_path, "w") as fh:
                fh.write(msg)
