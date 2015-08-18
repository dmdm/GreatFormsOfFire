import zope.interface


class IGreatFormsOfFireRootNode(zope.interface.Interface):
    pass


@zope.interface.implementer(IGreatFormsOfFireRootNode)
class GreatFormsOfFireRootNode(dict):
    __parent__ = None
    __name__ = ''
    pass


root = GreatFormsOfFireRootNode()


def root_factory(request):
    return root
