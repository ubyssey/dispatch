from dispatch.apps.frontend.helpers import theme_components
from dispatch.apps.frontend.fields import TextField, ModelField
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
        ('cover_url', 'Cover Image Link', TextField()),
    )
    
class ScoreBoard(BaseComponent):
    NAME = 'Live Scoreboard'
    SLUG = 'live_scoreboard'
    
    compatible_spots = ('multi_zone',)
    
    fields = (
        ('home_team_score', 'Home Team Score', TextField()),
        ('away_team_score', 'Away Team Score', TextField()),
    )

theme_components.register(ReadingList)
theme_components.register(PrintIssueDefault)
theme_components.register(ScoreBoard)
