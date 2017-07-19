class TemplateRegistry:

    def __init__(self):
        self.template_list = []
        self.templates = {}

    def register(self, template_class):
        if template_class.SLUG in self.template_list:
            self.template_list.remove(template_class.SLUG)
        self.template_list.append(template_class.SLUG)
        self.templates[template_class.SLUG] = template_class

    def get(self, slug):
        return self.templates[slug]

    def all(self):
        return [self.templates[slug] for slug in self.template_list]

theme_components = TemplateRegistry()
theme_pages = TemplateRegistry()
templates = TemplateRegistry()
