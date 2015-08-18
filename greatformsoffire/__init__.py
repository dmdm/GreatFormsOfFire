import os.path
from pyramid.config import Configurator
import pym
from pym.rc import Rc

# For this sample application we use a simple hard-wired resource tree.
# If you want to use the full resource tree as defined by Parenchym in the
# database, uncomment the line below to use Parenchym's root factory.
from greatformsoffire.res.models import root_factory
# from pym.res.models import root_factory


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    # Init Rc
    # Get Rc instance like this, then use its methods e.g. g() or s():
    #     request.registry.settings['rc']
    # Rc data is merged directly into settings, so you can retrieve it like
    # this:
    #     request.registry.settings['project']
    if 'environment' not in settings:
        raise KeyError('Missing key "environment" in config. Specify '
            'environment in paster INI file.')
    rc = Rc(
        environment=settings['environment'],
        root_dir=os.path.abspath(
            os.path.join(os.path.dirname(__file__), '..')
        )
    )
    rc.load()
    settings.update(rc.data)
    rc.s('environment', settings['environment'])
    # Put rc into config settings
    settings['rc'] = rc

    # Create config
    config = Configurator(
        settings=settings
    )
    config.include(pym)
    config.commit()
    config.include(includeme)

    return config.make_wsgi_app()


def includeme(config):
    # Set our own root factory
    config.set_root_factory(root_factory)

    # Run scan() which also imports db models
    config.scan('greatformsoffire')

    # i18n
    config.add_translation_dirs('greatformsoffire:locale/')

    # Static assets for this project
    _setup_static_dir(config.registry.settings['environment'])
    config.add_static_view('static-greatformsoffire', 'greatformsoffire:static')

    # Override Pym's layouts with ours, e.g. for system pages
    config.override_asset(
        to_override='pym:templates/_layouts/',
        override_with='greatformsoffire:templates/_layouts/'
    )


def _setup_static_dir(environ: str):
    """
    Sets up a directory to contain static content.

    Typically this is a directory in the project's package. However, our client
    sided application with all of its static elements is located outside of
    this package. To avoid absolute paths in using the static view and keep the
    package-syntax, we create a symbolic link inside this package that points to
    the actual directory. The source of this symlink may be different, depending
    on our environment: 'dist' for production, 'src' for all other environments.

    .. warning:: This means, we cannot run a development server and a production
        server simultaneously from the same installation.

    :param environ: Our environment, see :class:`pym.rc.Rc` for details.
    :raises FileExistsError: If this static directory already exists and is not
        a symlink.
    """
    here = os.path.dirname(__file__)
    static_dir = os.path.join(here, 'static')
    there = os.path.join(here, '..', 'client',
        'dist' if environ == 'production' else 'src')
    if os.path.exists(static_dir):
        if not os.path.islink(static_dir):
            raise FileExistsError(
                "Static dir '{}' already exists and is not a symlink."
                " Investigate and remove it.".format(static_dir))
        os.unlink(static_dir)
    os.symlink(there, static_dir, target_is_directory=True)
