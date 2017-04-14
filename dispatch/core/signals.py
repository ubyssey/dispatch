from django.dispatch import Signal

post_create = Signal(providing_args=['instance'])
post_update = Signal(providing_args=['instance'])
