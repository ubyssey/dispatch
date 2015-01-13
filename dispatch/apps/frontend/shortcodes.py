from django.template import loader, Context

class ShortcodeLibrary():

    def __init__(self):
        self.library = dict()

    def register(self, name, function):
        self.library[name] = function

    def call(self, name, args):
        return self.library[name](args)

sclib = ShortcodeLibrary()

def sc_snippet(*args):
    filename = args[0][0]
    template = loader.get_template(filename)
    c = Context({})
    return template.render(c)

sclib.register('snippet', sc_snippet)