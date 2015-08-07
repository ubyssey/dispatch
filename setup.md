# Dispatch


### We <3 help, here's how to get started

* Press the fork button and create your own version of Dispatch
* Clone your new repository locally onto your computer with `git clone https://github.com/yourusername/dispatch.git`
* Once downloaded you can run `pip install -r requirements.txt` in the root of the `dispatch` directory to install the required Python dependencies

Before going much further it would be a good time to check you have a recent version of Python and Django running. You can install Django with `pip install Django` if you don't have it.

Running `Python 2.7.8` or higher, and `Django 1.7.2` or higher should be fine for this project.

### MySQL

If you don't have MySQL already installed it can be installed with homebrew by running `brew install mysql`.

Once installed: 

* Start MySQL and open the MySQL console
* Create a database with `CREATE DATABASE dispatch;`
* If this works, you'll be able to then type `SHOW DATABASES;` and see `dispatch` is now a database
* Update the `PASSWORD` field in the `DATABASE` section of `/dispatch/settings.py` if you have MySQL privileges set to require a password
* Close the MySQL console with `exit`

Once you have MySQL all setup, you can then run `python manage.py syncdb` to create the tables that will be used by Django.

It will also ask you to create a superuser with an email and password that can be used to access Django's admin section once the app is running.


### Serve me Dispatch

Now for the fun bit, getting Dispatch serving pages!

* Start serving the app with `python manage.py runserver`
* You will also need to serve the static contents of the site at the same time. Do this by opening the `dispatch` directory in another shell window and running `python -m SimpleHTTPServer 8888`

Now open `http://localhost:8000/` in your browser.


### Troubleshooting

If you run into problems serving up the site because of migration issues, it may help to run the following before the `syncdb` command:

`python manage.py makemigrations`

`python manage.py migrate`








 
