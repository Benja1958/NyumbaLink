"""add email verification

Revision ID: 74429a8befce
Revises: 45857916da2f
Create Date: 2026-08-17 23:25:52.791877

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "74429a8befce"
down_revision: Union[
    str,
    Sequence[str],
    None,
] = "45857916da2f"

branch_labels: Union[
    str,
    Sequence[str],
    None,
] = None

depends_on: Union[
    str,
    Sequence[str],
    None,
] = None


def upgrade() -> None:
    op.create_table(
        "email_verification_tokens",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "token_hash",
            sa.String(),
            nullable=False,
        ),
        sa.Column(
            "expires_at",
            sa.DateTime(timezone=True),
            nullable=False,
        ),
        sa.Column(
            "used_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f(
            "ix_email_verification_tokens_id"
        ),
        "email_verification_tokens",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_email_verification_tokens_token_hash"
        ),
        "email_verification_tokens",
        ["token_hash"],
        unique=True,
    )

    op.create_index(
        op.f(
            "ix_email_verification_tokens_user_id"
        ),
        "email_verification_tokens",
        ["user_id"],
        unique=False,
    )

    op.add_column(
        "users",
        sa.Column(
            "email_verified",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    op.add_column(
        "users",
        sa.Column(
            "email_verified_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )

    op.alter_column(
        "users",
        "email_verified",
        server_default=None,
    )


def downgrade() -> None:
    op.drop_column(
        "users",
        "email_verified_at",
    )

    op.drop_column(
        "users",
        "email_verified",
    )

    op.drop_index(
        op.f(
            "ix_email_verification_tokens_user_id"
        ),
        table_name=(
            "email_verification_tokens"
        ),
    )

    op.drop_index(
        op.f(
            "ix_email_verification_tokens_token_hash"
        ),
        table_name=(
            "email_verification_tokens"
        ),
    )

    op.drop_index(
        op.f(
            "ix_email_verification_tokens_id"
        ),
        table_name=(
            "email_verification_tokens"
        ),
    )

    op.drop_table(
        "email_verification_tokens"
    )