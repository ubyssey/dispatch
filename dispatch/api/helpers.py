from dispatch.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.models import Group

def get_settings(token):
    user = User.objects.get(auth_token=token)

    is_admin = False
    if user.groups.filter(name='Admin').exists() or user.is_superuser:
        is_admin = True

    return {
        'is_admin': is_admin
    }

def build_url(uuid):
    return settings.BASE_URL + 'admin/signup/' + str(uuid)

def send_invitation(email, uuid):
    url = build_url(uuid)
    send_mail(
        'You\'ve been invited to the Ubyssey',
        'Welcome to the Ubyssey! You can set your password and login at the link below\n(This link will expire in 24 hours)\n' + url,
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False
    )

def modify_permissions(user, permissions):
    if permissions == 'admin':
        group = Group.objects.get(name='Admin')
        user.groups.add(group)
    else:
        group = Group.objects.get(name='Admin')
        user.groups.remove(group)

def reset_password(email, request):
    form = PasswordResetForm({'email': email})
    if form.is_valid():
        return form.save(from_email=settings.EMAIL_HOST_USER, email_template_name='registration/password_reset_email.html', request=request)
