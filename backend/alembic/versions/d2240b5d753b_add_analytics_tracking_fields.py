"""add analytics tracking fields

Revision ID: d2240b5d753b
Revises: c76ef3ed80e1
Create Date: 2026-09-12 18:00:26.800310

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd2240b5d753b'
down_revision: Union[str, Sequence[str], None] = 'c76ef3ed80e1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "listings",
        sa.Column(
            "views_count",
            sa.Integer(),
            nullable=False,
            server_default=sa.text("0"),
        ),
    )

    op.add_column(
        "listings",
        sa.Column(
            "availability_confirmations_count",
            sa.Integer(),
            nullable=False,
            server_default=sa.text("0"),
        ),
    )

    op.alter_column(
        "listings",
        "views_count",
        server_default=None,
    )

    op.alter_column(
        "listings",
        "availability_confirmations_count",
        server_default=None,
    )

    op.add_column(
        "users",
        sa.Column(
            "last_login_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "last_login_at")
    op.drop_column("listings", "availability_confirmations_count")
    op.drop_column("listings", "views_count")
