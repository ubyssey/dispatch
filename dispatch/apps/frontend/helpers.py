def print_templates(name):
    module = __import__(name)
    for member in dir(module):
        print member

class TemplateRegistry:

    def __init__(self):
        self.templates = []

    def register(self, template_class):
        self.templates.append(template_class)

    def all(self):
        return self.templates

templates = TemplateRegistry()