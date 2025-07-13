"""Remove redundant happened column - Event

Revision ID: 8b8a6e84a18b
Revises: 4bb7f8887bfb
Create Date: 2025-07-13 19:14:34.362746

"""
import sqlalchemy as sa

from alembic import op  # type: ignore

# revision identifiers, used by Alembic.
revision = "8b8a6e84a18b"
down_revision = "4bb7f8887bfb"
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column("events", "happened")


def downgrade():
    op.add_column("events", sa.Column("happened", sa.Boolean(), nullable=True))
