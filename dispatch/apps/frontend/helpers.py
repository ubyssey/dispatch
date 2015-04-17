def print_templates(name):
    module = __import__(name)
    for member in dir(module):
        print member

class TemplateRegistry:

    def __init__(self):
        self.templates = []

    def register(self, template_class):
        self.templates.append(template_class)

    def get(self, slug):
        for template in self.templates:
            if template.SLUG == slug:
                return template
        return None

    def all(self):
        return self.templates

class ComponentRegistry(TemplateRegistry):
    def get_for_spot(self, spot):
        templates = []
        for template in self.templates:
            if spot in template.compatible_spots:
                templates.append(template)
        return templates

theme_components = ComponentRegistry()
theme_pages = TemplateRegistry()
templates = TemplateRegistry()