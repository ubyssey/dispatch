Dispatch
=====================
<a href="https://zenhub.io"><img src="https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png" height="18px"></a> <a href="https://travis-ci.org/ubyssey/dispatch"><img src=https://travis-ci.org/ubyssey/dispatch.svg?branch=develop  height="18px"></a>

v 0.1

### We <3 help, here's how to get started

* Press the fork button and create your own version of Dispatch
* Clone your new repository locally onto your computer with `git clone https://github.com/yourusername/dispatch.git`
* (Optional, but recommended) Create a [virtualenv][1] for Dispatch's dependencies with `virtualenv dispatch-env`, and activate it with `. dispatch-env/bin/activate` before running any Python commands related to Dispatch
* Once downloaded you can run `pip install -r requirements.txt` in the root of the `dispatch` directory to install the required Python dependencies

Before going much further it would be a good time to check you have a recent version of Python and Django running. You can install Django with `pip install Django` if you don't have it.

Running `Python 2.7.8` or higher (Dispatch is tested on Python 2), and `Django 1.7.2` or higher should be fine for this project.

[1]: http://docs.python-guide.org/en/latest/dev/virtualenvs/

### MySQL

If you don't have MySQL already installed it can be installed on OS X with homebrew by running `brew install mysql`.

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

#### Static files

Although the Django development server is capabable of serving static files, we find it's faster to deliver them separately. 

* Open the `dispatch` directory in another shell window and run `python manage.py collectstatic` to collect all of Dispatch's static files into one directory.
* Run `python -m SimpleHTTPServer 8888` from the same directory to start a basic static file server.

*Note: this is one of many ways to configure static files for a Django project, and may not be the best configuration for your system. [More information on serving static files with Django.](https://docs.djangoproject.com/en/1.8/howto/static-files/#serving-static-files-during-development)*

Now open `http://localhost:8000/` in your browser.

#### Building static assets

**CSS** is written in [Sass][] with [Compass][]. To compile the CSS, navigate to `dispatch/themes/ubyssey/static/css` and run `compass compile`. Or, run `compass watch` to update as you edit files.

**Javascript/JSX** is managed with [Gulp][]. To compile, navigate to `dispatch/themes/ubyssey/static/js` and run `gulp article` (if you're using a virtualenv, make sure it's activated for this). To setup Gulp, first install NPM if necessary, then run `npm install` in that directory.

[Sass]: http://sass-lang.com
[Compass]: http://compass-style.org
[Gulp]: http://gulpjs.com/

### Troubleshooting

If you run into problems serving up the site because of migration issues, it may help to run the following before the `syncdb` command:

`python manage.py makemigrations`

`python manage.py migrate`
