from dispatch.apps.core.models import Action
from dispatch.apps.content.models import Article

def perform_action(person, action, object_type, object_id):

    Action.objects.create(person=person, action=action, object_type=object_type, object_id=object_id)

def list_actions(count=25):

    VERBS = {
        'create': 'created',
        'update': 'updated',
        'publish': 'published',
    }

    ICONS = {
        'create': 'plus',
        'update': 'edit',
        'publish': 'check-circle',
    }

    actions = Action.objects.all().order_by('-timestamp')[:count]

    results = []

    for action in actions:
        if action.object_type == 'article':
            #try:
            article = Article.objects.get(parent_id=action.object_id, head=True)
            text = '%s %s <a href="%s">%s</a>' % (action.person.full_name, VERBS[action.action], article.get_absolute_url(), article.long_headline)
            #except:
            #    break


        results.append({
            'icon': ICONS[action.action],
            'text': text,
            'timestamp': action.timestamp
        })

    return results


