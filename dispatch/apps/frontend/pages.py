from dispatch.apps.frontend.models import ComponentSet
from dispatch.helpers.theme import ThemeHelper

class BasePage:

    def components(self):

        try:
            instance = ComponentSet.objects.get(slug=self.SLUG)
        except ComponentSet.DoesNotExist:
            return None

        spots = {}

        components = ThemeHelper.get_theme_components()

        for component in instance.components.all():
            component_class = components.get(component.slug)
            spots[component.spot] = component_class(instance=component, spot=component.spot)

        return spots
