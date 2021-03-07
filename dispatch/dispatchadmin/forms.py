from django import forms
from django.contrib.auth.forms import UserCreationForm
from dispatch.models import User

class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('password1', 'password2')
