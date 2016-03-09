from dispatch.apps.core.models import User, Person
from django.forms import Form, ModelForm, TextInput, CharField, EmailField, PasswordInput, ValidationError

class RegistrationForm(ModelForm):

    full_name = CharField(label='Full name')
    password1 = CharField(label='Password', widget=PasswordInput)
    password2 = CharField(label='Password confirmation', widget=PasswordInput)

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        # Check that the two password entries match
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        elif self.cleaned_data.get("email") and not self.is_bound:
            raise ValidationError("Please enter a password")
        return password2

    def save(self, commit=True):

        # Save the provided password in hashed format
        user = super(RegistrationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])

        user.person = Person.objects.create(full_name=self.cleaned_data.get('full_name'), is_admin=False)

        if commit:
            user.save()
        return user

    class Meta:
        model = User
        fields = ('email',)