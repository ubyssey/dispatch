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

class ListController:

    @staticmethod
    def json(data):
        return data

    @staticmethod
    def render(data):
        html = "<ul>"
        for item in data:
            html += "<li>%s</li>" % item
        html += "</ul>"
        return html

class HeaderController:

    @staticmethod
    def json(data):
        return data

    @staticmethod
    def render(data):
        return "<h1>%s</h1>" % data['content']


embedlib.register('header', HeaderController)
embedlib.register('list', ListController)