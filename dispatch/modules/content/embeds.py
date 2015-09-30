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

class VideoController:

    @staticmethod
    def json(data):
        return data

    @staticmethod
    def render(data):
        template = loader.get_template("article/embeds/video.html")
        c = Context(data)
        return template.render(c)

class AdvertisementController:

    @staticmethod
    def json(data):
        return data

    @staticmethod
    def render(data):
        template = loader.get_template("article/embeds/advertisement.html")
        c = Context(data)
        return template.render(c)

class PullQuoteController:

    @staticmethod
    def json(data):
        return data

    @staticmethod
    def render(data):
        template = loader.get_template("article/embeds/quote.html")
        c = Context(data)
        return template.render(c)

class CodeController:
    @staticmethod
    def json(data):
        return data
        
    @staticmethod
    def render(data):
        if(data['mode'] == 'html'):
            return data['content']
        else:
            html = '<script type="text/%s">' % data['mode']
            html += data['content']
            html += "</script>"
            return html
        

embedlib.register('quote', PullQuoteController)
embedlib.register('code', CodeController)
embedlib.register('advertisement', AdvertisementController)
embedlib.register('header', HeaderController)
embedlib.register('list', ListController)
embedlib.register('video', VideoController)
