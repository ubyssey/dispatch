from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.urls import reverse

def build_url(uuid):
    return "%s%s" % (settings.BASE_URL.strip('/'), reverse('dispatch-signup', kwargs={'uuid': str(uuid)}))

def send_invitation(email, uuid):
    msg = render_to_string(
        'registration/invite_email.txt',
        {
            'organization': settings.ORGANIZATION_NAME,
            'url': build_url(uuid)
        }
    )

    send_mail(
        'You\'ve been invited to %s' % settings.ORGANIZATION_NAME,
        msg,
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False
    )

def reset_password(email, request):
    form = PasswordResetForm({'email': email})
    if form.is_valid():
        return form.save(
            from_email=settings.EMAIL_HOST_USER,
            email_template_name='registration/password_reset_email.html',
            request=request
        )
