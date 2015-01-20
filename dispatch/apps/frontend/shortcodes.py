from django.template import loader, Context
from dispatch.apps.content.models import Attachment

class ShortcodeLibrary():

    def __init__(self):
        self.library = dict()

    def register(self, name, function):
        self.library[name] = function

    def call(self, name, args):
        if name in self.library:
            return self.library[name](args)

sclib = ShortcodeLibrary()

def sc_snippet(*args):
    filename = args[0][0]
    template = loader.get_template(filename)
    c = Context({})
    return template.render(c)

def sc_image(*args):
    id = int(args[0][0])
    attach = Attachment.objects.get(id=id)
    template = loader.get_template("image.html")
    c = Context({
        'src': "http://dispatch.dev:8888/media/" + str(attach.image.img),
        'caption': attach.caption,
        'credit': ""
    })
    return template.render(c)

sclib.register('image', sc_image)
sclib.register('snippet', sc_snippet)