import datetime

from django.dispatch import receiver

from dispatch.core.signals import post_create, post_update
from dispatch.models import Article
from dispatch.modules.actions.models import Action

def perform_action(action, object_type, object_id, user):

    Action.objects.create(
        action=action,
        object_type=object_type,
        object_id=object_id,
        user=user
    )

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
            if action.user_id == next_action.user_id and action.object_type == next_action.object_type and action.object_id == next_action.object_id and action.action == next_action.action:
                continue

        if action.object_type == 'article':
            try:
                article = Article.objects.get(parent_id=action.object_id, head=True)

                meta = {
                    'id': action.object_id,
                    'author': action.user.person.full_name,
                    'headline': article.headline,
                    'count': count,
                    'action': SINGULAR[action.action] if count == 1 else PLURAL[action.action],
                }
            except:
                continue

            results.append({
                'icon': ICONS[action.action],
                'meta': meta,
                'timestamp': action.timestamp
            })

        count = 0

    return results

def recent_articles(user, count=5):

    time = datetime.datetime.now() - datetime.timedelta(days=7)

    actions = Action.objects.filter(user=user, object_type='article', timestamp__gt=time).order_by('-timestamp')
    articles = []

    for action in actions:

        try:
            article = Article.objects.get(parent_id=action.object_id, head=True)
            if article not in articles:
                articles.append(article)
        except:
            pass

    return articles

@receiver(post_create, sender=Article)
def action_create_article(sender, instance, user, **kwargs):
    perform_action('create', 'article', instance.parent_id, user)

@receiver(post_update, sender=Article)
def action_update_article(sender, instance, user, **kwargs):
    perform_action('update', 'article', instance.parent_id, user)
