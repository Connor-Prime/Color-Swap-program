from flask import Blueprint, render_template, request, redirect, flash 
from werkzeug.security import check_password_hash 
from flask_login import login_user, logout_user 


#internal import 
from App.models import User, db 
from App.forms import SignInForm, SignUpForm

auth=Blueprint('auth',__name__, template_folder='auth_templates')

@auth.route('/signup',methods=['GET', 'POST'])
def signUp():
    signUpForm =SignUpForm()

    if request.method=="POST" and signUpForm.validate_on_submit():

        username = signUpForm.username.data
        email = signUpForm.email.data
        password = signUpForm.password.data

        print(username, email, password)

        if User.query.filter(User.username==username).first():
            flash(f"Username already exists. Please Try Again", category='warning')
            return redirect('/signup')
        if User.query.filter(User.email==email).first():
            flash(f"Email already exists. Please Try Again", category='warning')
            return redirect('/signup')
        
        user = User(username=username,email=email, password=password)

        db.session.add(user)
        db.session.commit()

        flash(f"You successfully registered as {username}",category="success")
        return redirect('/signin')
    
    return render_template('sign_up.html', form=signUpForm )

@auth.route('/signin', methods=['GET', 'POST'])
def signIn():
    signInForm =SignInForm()

    if request.method=='POST' and signInForm.validate_on_submit():
        email = signInForm.email.data
        password = signInForm.password.data

        print("Post")

        print("login info", email, password)

        user=User.query.filter(User.email==email).first()

        if(user and check_password_hash(user.password,password)):
            login_user(user)
            flash(f"Successfully logged in {email}", category='success') 
            return redirect('/') #so if a user successfully logs in, we are going to send them home 
        else:
            flash("Invalid email or password. Please try again",category="warning")
            return redirect("/signin")
        
    return render_template('sign_in.html',form=signInForm)

@auth.route('/logout')
def logout():
    logout_user()
    return redirect('/')