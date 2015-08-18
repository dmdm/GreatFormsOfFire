import logging
from pyramid.security import (
    NO_PERMISSION_REQUIRED
)
from pyramid.view import view_defaults, view_config
import pym.models
import greatformsoffire.res.models


mlgg = logging.getLogger(__name__)


@view_defaults(
    context=greatformsoffire.res.models.IGreatFormsOfFireRootNode,
    permission=NO_PERMISSION_REQUIRED
)
class DefaultView(object):

    def __init__(self, context, request):
        self.context = context
        self.request = request
        self.rc = request.registry.settings['rc']
        # By default, use the module logger
        self.lgg = mlgg
        # Request's translate method is initialised by Parenchym's locale
        # negotiator.
        self.tr = self.request.localizer.translate
        # One DB session. Hand it down to called methods
        self.sess = pym.models.DbSession()

        # Dynamically created URLs for use in JavaScript. Do not hard-code URLs
        # there!
        self.urls = dict(
            base=request.resource_url(context),
            index=request.resource_url(context),
            static=request.static_url('greatformsoffire:static/')
        )

    @view_config(
        name='',
        renderer='index.mako'
    )
    def index(self):
        # Setup dict with config for JavaScript. It will be injected as constant
        # `RC` into the angular app.
        rc = {
            'urls': self.urls
        }
        # Localize all translation strings using the initialised translator
        # `self.tr`. It will be injected as constant `T` into the angular app.
        t = {}
        return {
            'rc': rc,
            't': t
        }
