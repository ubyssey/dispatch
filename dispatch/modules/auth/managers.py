from django.contrib.auth.models import BaseUserManager, Group

class UserManager(BaseUserManager):

    def __init__(self, personModel):
        super(BaseUserManager, self).__init__()

        self.personModel = personModel

    def _create_user(self, email, password=None, is_staff=False, is_active=True, is_superuser=False):
        if not email:
            raise ValueError('User must have a valid email address')

        if not self.is_valid_password(password):
            raise ValueError('Password is invalid')

        user = self.model(email=email, is_active=is_active, is_superuser=is_superuser)
        user.set_password(password)

        person = self.personModel.objects.create()
        user.person = person

        user.save()

        if is_staff == 'true':
            group = Group.objects.get(name='Admin')
            user.groups.add(group.id)


        return user

    def create_user(self, data):
        #return self._create_user(email, password, True, True, False)
        print('in manager!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        return self._create_user(email=data['email'], password='ubyssey2018', is_staff=data['is_staff'], is_active=True, is_superuser=False)
    # def create_user(self, validated_data):
    #     return

    def create_superuser(self, email, password):
        return self._create_user(email, password, True, True, True)

    def is_valid_password(self, password):
        return len(password) >= 8
