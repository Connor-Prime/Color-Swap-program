from werkzeug.security import generate_password_hash #generates a unique password hash for extra security 
from flask_sqlalchemy import SQLAlchemy #this is our ORM (Object Relational Mapper)
from flask_login import UserMixin, LoginManager #helping us load a user as our current_user 
from datetime import datetime #put a timestamp on any data we create (Users, Products, etc)
import uuid #makes a unique id for our data (primary key)

db = SQLAlchemy()
login_manager = LoginManager()

# get user from user id
@login_manager.user_loader
def load_user(user_id):
    '''
    get user from user id
    '''
    return User.query.get(user_id)

class User(db.Model, UserMixin):

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