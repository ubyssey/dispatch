from dispatch.models import User

def get_settings(token):
    user = User.objects.get(auth_token=token)

    is_admin = False

    if user.groups.filter(name='Admin').exists() or user.is_superuser:
        is_admin = True

    return {
        'is_admin': is_admin
    }
