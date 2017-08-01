import urllib, os

from django.core.files import File

from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, FileField, BooleanField, ForeignKey,
    SlugField, EmailField, SET_NULL)

from django.dispatch import receiver
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import send_mail
from django.db.models.signals import post_save

from dispatch.core.signals import post_create, post_update

from phonenumber_field.modelfields import PhoneNumberField

class Event(Model):

    title = CharField(max_length=255)
    description = TextField()
    host = CharField(max_length=255)

    image = ImageField(upload_to='images/events/', null=True, blank=True)

    start_time = DateTimeField(null=True, blank=True)
    end_time = DateTimeField(null=True, blank=True)

    location = CharField(max_length=500)
    address = CharField(max_length=500, null=True, blank=True)

    CATEGORY_CHOICES = (
        ('sports', 'Sports'),
        ('music', 'Music'),
        ('academic', 'Academic'),
        ('party', 'Party'),
        ('business', 'Business'),
        ('ceremony', 'Ceremony'),
        ('workshop', 'Workshop'),
        ('clubs', 'Clubs'),
        ('other', 'Other')
    )

    category = CharField(max_length=20, choices=CATEGORY_CHOICES)

    facebook_url = TextField(null=True, blank=True)
    ticket_url = TextField(null=True, blank=True)

    is_submission = BooleanField(default=False)
    is_published = BooleanField(default=False)
    is_published_email = BooleanField(default=False)
    is_approved_email = BooleanField(default=False)

    submitter_email = EmailField(null=True)
    submitter_phone = PhoneNumberField(null=True)

    def save_image_from_url(self, url):
        """Store image locally if a Facebook URL is passed"""

        result = urllib.urlretrieve(url)

        self.image.save(
            os.path.basename(url),
            File(open(result[0]))
        )

        self.save()


@receiver(post_update, sender=Event)
def send_approved_email(sender, instance, **kwargs):

    print instance.is_submission

    if not instance.is_approved_email and instance.is_submission:

        body = render_to_string('events/email/confirm.html', {'title': instance.title})

        send_mail(
                'Your event has been approved!',
                body,
                settings.EMAIL_HOST_USER,
                [instance.submitter_email],
                fail_silently=True,
            )

        instance.is_approved_email = True
        instance.save()

@receiver(post_update, sender=Event)
def send_published_email(sender, instance, **kwargs):

    if instance.is_published and not instance.is_published_email:

        body = render_to_string('events/email/success.html', {'id': instance.id})

        send_mail(
                'Your event has been published!',
                body,
                settings.EMAIL_HOST_USER,
                [instance.submitter_email],
                fail_silently=True,
            )

        instance.is_published_email = True
        instance.save()
