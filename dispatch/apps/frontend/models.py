from django.db.models import Model, CharField, FileField


class FileResource(Model):
    name = CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name if self.name else self.filename

class Snippet(FileResource):
    source = FileField(upload_to='snippets')

class Script(FileResource):
    source = FileField(upload_to='scripts')

class Stylesheet(FileResource):
    source = FileField(upload_to='stylesheets')

