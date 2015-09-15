from dispatch.apps.frontend.models import ComponentSet
from dispatch.helpers import ThemeHelper

class BasePage:

    def components(self):
        instance = ComponentSet.objects.get(slug=self.SLUG)

        spots = {}

        components = ThemeHelper.get_theme_components()

        for component in instance.components.all():
            component_class = components.get(component.slug)
            spots[component.spot] = component_class(instance=component, spot=component.spot)

        return spots