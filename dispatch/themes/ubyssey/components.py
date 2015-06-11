from dispatch.apps.frontend.helpers import theme_components
from dispatch.apps.frontend.components.fields import TextField, ModelField
from dispatch.apps.frontend.components import BaseComponent

class ReadingList(BaseComponent):

    NAME = 'Reading List'
    SLUG = 'reading_list'

    compatible_spots = ('multi_zone',)

    fields = (
        ('title', 'Title', TextField()),
        ('articles', 'Articles', ModelField(model='article', many=True)),
    )

class PrintIssueDefault(BaseComponent):

    NAME = 'Default'
    SLUG = 'print_issue_default'

    compatible_spots = ('print_issue',)

    fields = (
        ('url', 'Issue link', TextField()),
    )

theme_components.register(ReadingList)
theme_components.register(PrintIssueDefault)
