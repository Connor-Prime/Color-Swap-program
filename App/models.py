from werkzeug.security import generate_password_hash #generates a unique password hash for extra security 


# Flask Alchemy Imports
from flask_sqlalchemy import SQLAlchemy #this is our ORM (Object Relational Mapper)
from flask_login import UserMixin, LoginManager #helping us load a user as our current_user )
from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from flask_marshmallow import Marshmallow

from datetime import datetime #put a timestamp on any data we create (Users, Products, etc)
import uuid #makes a unique id for our data (primary key)

db = SQLAlchemy()
login_manager = LoginManager()
ma = Marshmallow() #makes marshmallow object 

# get user from user id
@login_manager.user_loader
def load_user(user_id):
    '''
    get user from user id
    '''
    return User.query.get(user_id)

class User(db.Model, UserMixin):
    __tablename__ = "user"
    user_id = db.Column(db.String, primary_key = True)

    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(35), nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username,email, password):
        self.username=username
        self.email = email
        self.user_id=self.set_id()
        self.password=self.set_password(password)


    def __repr__(self):
        return f"<User: {self.username}>"
    
    def set_password(self, password):
         return generate_password_hash(password)

    def set_id(self):
        return str(uuid.uuid4())

    def get_id(self):
        return str(self.user_id)
    
class Image(db.Model):

    __tablename__ = "Image"

    image_id = db.Column(db.String(),primary_key=True)
    name = db.Column(db.String(50))
    image = db.Column(db.String(45000))
    description = db.Column(db.String(200))
    user_id = db.Column(db.String, db.ForeignKey('user.user_id'))

 
    
    def __init__(self, name, image,user_id,description=""):
        self.name = name
        self.image = image
        self.user_id = user_id
        self.description = description
        self.image_id = self.set_id()

    def set_id(self):
        return str(uuid.uuid4())

class ImageSchema(ma.Schema):

    class Meta:
        fields = ['image_id','name', 'image', 'description', 'user_id']


product_schema = ImageSchema() #this is 1 singular product
products_schema = ImageSchema(many=True) 