Great Forms Of Fire
===================

Simple sample application to show the use of [Parenchym](https://github.com/dmdm/Parenchym).

It also shows how an AngularJS application can be integrated into the Mako
templates of the Python application, based on Google's [Angular Material Start](https://github.com/angular/material-start)
(slightly changed and corrected).

We setup a complete environment to develop JavaScript code
comfortably: compile SASS, concat and minify JavaScript, reload the browser etc
with ``gulp``.

Being a simple sample, we hard-wire the resource tree. If you want to use the
prepared resource tree from Parenchym in the database (as you must if you want
authentication, ACLs etc.), use Parenchym's root factory instead. See comments
in ``greatformsoffire/__init__.py`` and ``greatformsoffire/res/models.py`` for
details.


Installation
------------

### Python Virtual Environment

Create one and activate it:

    pyvenv greatformsoffire-py3.4-venv
    source greatformsoffire-py3.4-venv/bin/activate
         # or: workon greatformsoffire-py3.4-venv

    pip install -U pip

Clone this repository and install it in development mode:

    git clone https://github.com/dmdm/GreatFormsOfFire
    cd GreatFormsOfFire
    pip install -e .

**For the remaining installation steps, make sure you are in the project
directory ``GreatFormsOfFire``!**

### Directories and Permissions

Configure ``bin/setup_dirs`` to your needs and run it (maybe use ``sudo``).


### Create and init Database

We use PostgreSQL by default. Change these steps to match your server.

1. Run SQL script ``install/db/create_database.sql`` to create an user account
   and the database itself.

1. Create a subdirectory for the configuration of your host in ``etc/``, e.g.
   by duplicating ``etc/Morrigan`` and create a file ``rcsecrets.yaml`` in the
   appropriate directory for your environment. See ``etc/Morrigan/development/rcsecrets.yaml-sample``
   for an example. Adjust the SQLAlchemy URL.

1. Run ``pym-init-db -c development.ini``


Running
-------

**This branch uses ES6 modules.**

Based on the ES6 branch of material-start, we use JSPM and the traceur
transpiler. By default, we load traceur in the browser and compile each file
on the fly.

TODO

- Bundling and pre-compiling.
- gulp serve is broken at the moment (any task that handles scripts). Need to
  use gulp_traceur.

### Development

Run the development server with

    $VENV/bin/pserve development.ini

It listens to 0.0.0.0:6543 which you directly can access in your browser at
`http://localhost:6543`.

If you want to use file watchers to automatically compile SASS etc. and reload
the browser, in another console run

    gulp serve


### Production

Run the production server with

    $VENV/bin/pserve production.ini

It listens to 127.0.0.1:7100 which you directly can access in your browser at
`http://localhost:6543`.

You may want to build the distribution version of the client app (e.g.
concatenated and minified JavaScript etc) with

    gulp serve:dist

In case you want for production a different web server than Waitress, e.g.
gunicorn, look at `etc/Morrigan` for sample configuration.


Misc Hints
----------

1/

Add static files, like images etc to ``client/src/assets/img``, and not to
``greatformsoffire/static``. The latter is a symlink that points to the former
and changes for production/development.

2/

You may use this simple sample as a starter for your own project. Perform
global search and replace on "GreatFormsOfFire", "greatformsoffire" and "gfof".


TODO
----

Setup testing environment, behave, karma etc.
