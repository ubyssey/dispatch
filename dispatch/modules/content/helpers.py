from dispatch.apps.content.models import Article

def generate_frontpage():
    return Article.objects.order_by('-importance', 'published_at')


