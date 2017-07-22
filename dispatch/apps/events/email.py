from django.dispatch import receiver
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import send_mail

from dispatch.core.signals import post_create, post_update
from dispatch.apps.events.models import Event

@receiver(post_update, sender=Event)
def send_published_email(sender, **kwargs):
    print 'this may work'
    # template = render_to_string('events/email/success.html', form_data)
    #
    # send_mail(
    #         'Your event has been created!',
    #         template,
    #         settings.EMAIL_HOST_USER,
    #         [form.cleaned_data['submitter_email']],
    #         fail_silently=False,
    #     )
