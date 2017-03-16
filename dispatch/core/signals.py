from django.dispatch import Signal

article_post_save = Signal(providing_args=['article'])
