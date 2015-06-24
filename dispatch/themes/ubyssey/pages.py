from dispatch.apps.frontend.helpers import theme_pages
from dispatch.apps.frontend.pages import BasePage

class Homepage(BasePage):

    NAME = 'Homepage'
    SLUG = 'homepage'

    component_spots = (
        ('multi_zone', 'Multi-Zone'),
        ('print_issue', 'Print Issue Box'),
    )

theme_pages.register(Homepage)
