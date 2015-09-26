import datetime

from dispatch.apps.core.models import Action
from dispatch.apps.content.models import Article

def perform_action(person, action, object_type, object_id):

    Action.objects.create(person=person, action=action, object_type=object_type, object_id=object_id)

def list_actions(count=25):

    SINGULAR = {
        'create': 'created',
        'update': 'updated',
        'publish': 'published',
    }

    PLURAL = {
        'update': 'updates',
    }

    ICONS = {
        'create': 'plus',
        'update': 'edit',
        'publish': 'check-circle',
    }

    actions = Action.objects.all().order_by('-timestamp')[:count]

    results = []
    count = 0

    for n, action in enumerate(actions):
        count += 1
        if n < len(actions) - 1:
            next_action = actions[n+1]
            if action.person == next_action.person and action.object_type == next_action.object_type and action.object_id == next_action.object_id and action.action == next_action.action:
                continue

        if action.object_type == 'article':
            try:
                article = Article.objects.get(parent_id=action.object_id, head=True)
                if count == 1:
                    text = '%s %s <a href="%s">%s</a>' % (action.person.full_name, SINGULAR[action.action], article.get_absolute_url(), article.headline)
                else:
                    text = '%s made %d %s to <a href="%s">%s</a>' % (action.person.full_name, count, PLURAL[action.action], article.get_absolute_url(), article.headline)
            except:
                continue

            results.append({
                'icon': ICONS[action.action],
                'text': text,
                'timestamp': action.timestamp
            })

        count = 0

    return results

def recent_articles(person, count=5):

    time = datetime.datetime.now() - datetime.timedelta(days=7)

    actions = Action.objects.filter(person=person, object_type='article', timestamp__gt=time).order_by('-timestamp')
    articles = []

    for action in actions:

        try:
            article = Article.objects.get(parent_id=action.object_id, head=True)
            if article not in articles:
                articles.append(article)
        except:
            pass

    return articles



