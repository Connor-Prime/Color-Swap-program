
from flask import Blueprint, redirect, render_template, request, flash
from flask_login import current_user
import json,tempfile
import time
# Internal imports
from App.forms import SaveImageForm, UpdateImageForm
from App.models import User, db 
from App.models import Image

site = Blueprint('site', __name__, template_folder='site_templates')




@site.route("/")
def shop(id=None):

    if id != None:
        updateForm = UpdateImageForm()
        image = Image.query.filter(Image.image_id==id).first()
        data=image
        imageDict = { "image":image.image,
                      "name":image.name,
                      "id":image.image_id,
                      "description":image.description
                     }
    else:
        data=None
        updateForm = None
        imageDict = None

    saveForm = SaveImageForm()
    

    return render_template('home.html', form=saveForm,image=data,updateForm = updateForm,imageDict = imageDict)


@site.route('/add_image/', methods=['POST'])
def home():
    return open()

def open(image=None):

    form = SaveImageForm()

    if request.method == 'POST' and form.validate_on_submit():
        name = form.name.data
        image = form.image.data
        description = form.description.data

        user = current_user

        print(current_user.get_id())

        newImage = Image(name,image, user.get_id(),description)

        db.session.add(newImage)
        db.session.commit()

        print(newImage.image)

        flash(f"{name} has been added to your images.",category="success")

        return redirect("/yourProjects")
        

    elif request.method == 'POST':
        flash("We were unable to process your request", category='warning')
        return redirect("/")
    
@site.route("/yourProjects")
def viewProjects():

    user = current_user
    images = Image.query.filter(Image.user_id==user.user_id)
    

    return render_template('projectsPage.html',images=images,form=SaveImageForm())

@site.route("/open_image/<id>")
def open_image(id):
    return shop(id=id)

@site.route("/save_image/",methods=['POST'])
def save_image():
    form = UpdateImageForm()
    if request.method == 'POST':
        image = Image.query.get(form.id.data)
        image.image=form.image.data
        db.session.commit()
        return redirect(f'/open_image/{form.id.data}')
    else:
        return redirect(f'/open_image/{form.id.data}')
    
@site.route("/delete_image/<id>")
def delete_image(id):

    image = Image.query.get(id)

    db.session.delete(image)
    db.session.commit()

    flash(f"{image.name} deleted", category='success')
    return redirect("/yourProjects")
