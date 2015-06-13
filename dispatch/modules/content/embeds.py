from django.template import loader, Context

class EmbedLibrary():

    def __init__(self):
        self.library = dict()

    def register(self, name, function):
        self.library[name] = function

    def call(self, name, args):
        if name in self.library:
            return self.library[name](args)

    def json(self, type, data):
        if type in self.library:
            return self.library[type].json(data)
        else:
            return data

    def render(self, type, data):
        if type in self.library:
            return self.library[type].render(data)

embedlib = EmbedLibrary()