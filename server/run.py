from app import create_app, db
from app.models.admin import Admin
import click


app = create_app()


@app.cli.command("seed-admin")
def seed_admin():
    """Create the initial System Admin if it doesn't exist."""
    email = "admin@journeytofire.com"

    existing = Admin.query.filter_by(email=email).first()

    if existing:
        click.echo(f"Admin already exists (id={existing.id}, email={existing.email})")
        return

    admin = Admin(
        name="System Admin",
        email=email,
        phone="+254700000000",
        is_active=True,
    )

    admin.set_password("Admin@123")

    db.session.add(admin)
    db.session.commit()

    click.echo(f"Created admin (id={admin.id}, email={admin.email})")


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )