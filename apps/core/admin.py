from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from passlib.apps import custom_app_context as pwd_context
from .models import User, Person, ContributorRole

class PersonInline(admin.StackedInline):
    model = Person
    max_num = 1
    extra = 1

class UserCreationForm(forms.ModelForm):
    #Don't take the plaintext password in, hash it upon entry
    password_hash1 = pwd_context.encrypt(forms.CharField(label='Password', widget=forms.PasswordInput))
    password_hash2 = pwd_context.encrypt(forms.CharField(label='Password confirmation', widget=forms.PasswordInput))

    class Meta:
        model = User
        fields = ('email',)

    def clean_password2(self):
        # Check that the two password entries match
        password_hash1 = self.cleaned_data.get("password1")
        password_hash2 = self.cleaned_data.get("password2")
        if password_hash1 and password_hash2 and password_hash1 != password_hash2:
            raise forms.ValidationError("Passwords don't match")
        return password_hash2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(label= ("Password"),
        help_text= ("Raw passwords are not stored, so there is no way to see "
                    "this user's password, but you can change the password "
                    "using <a href=\"password/\">this form</a>."))
    class Meta:
        model = User

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]

class UserAdmin(UserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

    inlines = [ PersonInline, ]

    list_display = ['email']
    list_filter = ['is_admin']
    ordering = ['email']

admin.site.register(User, UserAdmin)
admin.site.register(Person)
admin.site.register(ContributorRole)
