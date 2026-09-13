from app import create_app
from app.models.admin import Admin
from app import db

app = create_app()

output_path = "scripts/check_admin_output.txt"

with app.app_context():
    try:
        admins = Admin.query.all()
        lines = []
        if not admins:
            lines.append("NO_ADMINS\n")
        else:
            for a in admins:
                lines.append(f"id={a.id}, name={a.name}, email={a.email}, active={a.is_active}, created_at={a.created_at}\n")
        with open(output_path, "w") as fh:
            fh.writelines(lines)
    except Exception as e:
        with open(output_path, "w") as fh:
            fh.write(f"ERROR: {e}\n")
