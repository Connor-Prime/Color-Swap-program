"""updated image string size

Revision ID: 24aefa4d2b30
Revises: 165aa782fcf1
Create Date: 2023-12-13 09:08:54.661526

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '24aefa4d2b30'
down_revision = '165aa782fcf1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Image',
    sa.Column('image_id', sa.String(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=True),
    sa.Column('image', sa.String(length=45000), nullable=True),
    sa.Column('description', sa.String(length=200), nullable=True),
    sa.Column('user_id', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('image_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Image')
    # ### end Alembic commands ###
