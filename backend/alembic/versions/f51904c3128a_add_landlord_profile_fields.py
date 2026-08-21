"""add landlord profile fields

Revision ID: f51904c3128a
Revises: 74429a8befce
Create Date: 2026-08-19 14:29:16.778308

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f51904c3128a'
down_revision: Union[str, Sequence[str], None] = '74429a8befce'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "profile_image_url",
            sa.String(),
            nullable=True,
        ),
    )

    op.add_column(
        "users",
        sa.Column(
            "about",
            sa.String(),
            nullable=True,
        ),
    )

    op.add_column(
        "users",
        sa.Column(
            "is_verified_landlord",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    op.alter_column(
        "users",
        "is_verified_landlord",
        server_default=None,
    )


def downgrade() -> None:
    op.drop_column(
        "users",
        "is_verified_landlord",
    )

    op.drop_column(
        "users",
        "about",
    )

    op.drop_column(
        "users",
        "profile_image_url",
    )
