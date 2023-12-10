from flask import Flask 
from flask_migrate import Migrate


# internal imports
from .blueprints.site.routes import site
from .blueprints.auth.routes import auth
from config import Config 
from .models import login_manager, db




#instantiating our Flask app
app = Flask(__name__) #passing in the __name__ variable which just takes the name of the folder we're in
app.config.from_object(Config)

# Setting up login manager
login_manager.init_app(app)
login_manager.login_view="auth.sign_in"
login_manager.login_message="Log in to save your images online."
login_manager.login_message_category = 'warning'

# registering our blueprints
app.register_blueprint(site)
app.register_blueprint(auth)

db.init_app(app)
migrate = Migrate(app, db)