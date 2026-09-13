"""add admin roles and master admin

Revision ID: 1dd60d78d9ce
Revises: 5f5a0093c460
Create Date: 2026-09-13 16:15:49.166331

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1dd60d78d9ce'
down_revision = '5f5a0093c460'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('admins', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                'role',
                sa.String(length=30),
                nullable=True,
                server_default='admin'
            )
        )
        batch_op.add_column(
            sa.Column(
                'is_master',
                sa.Boolean(),
                nullable=True,
                server_default=sa.false()
            )
        )

    op.execute("UPDATE admins SET role = 'admin' WHERE role IS NULL")
    op.execute("UPDATE admins SET is_master = false WHERE is_master IS NULL")

    with op.batch_alter_table('admins', schema=None) as batch_op:
        batch_op.alter_column(
            'role',
            existing_type=sa.String(length=30),
            nullable=False,
            server_default='admin'
        )
        batch_op.alter_column(
            'is_master',
            existing_type=sa.Boolean(),
            nullable=False,
            server_default=sa.false()
        )


def downgrade():
    with op.batch_alter_table('admins', schema=None) as batch_op:
        batch_op.alter_column(
            'is_master',
            existing_type=sa.Boolean(),
            nullable=True,
            server_default=None
        )
        batch_op.alter_column(
            'role',
            existing_type=sa.String(length=30),
            nullable=True,
            server_default=None
        )
        batch_op.drop_column('is_master')
        batch_op.drop_column('role')
