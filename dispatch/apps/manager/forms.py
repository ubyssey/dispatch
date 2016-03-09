from django.forms import Form, ModelForm, TextInput, Textarea, CharField, PasswordInput, ValidationError, HiddenInput
from django.forms.models import inlineformset_factory, BaseInlineFormSet
from dispatch.apps.content.models import Article, Section, File, Image, ImageAttachment
from dispatch.apps.core.models import User, Person
from django.contrib.auth.models import Group

import uuid

class UserForm(ModelForm):

    password1 = CharField(label='Password', widget=PasswordInput, required=False)
    password2 = CharField(label='Password confirmation', widget=PasswordInput, required=False)

    def __init__(self, *args,  **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)

    def missing_password(self):
        return self.data.get('password1', False) and not self.data.get('password2', False) or not self.data.get('password1', False) and self.data.get('password2', False)

    def empty_passwords(self):
        return not self.data.get('password1', False) and not self.data.get('password2', False)

    def clean(self):
        if not self.is_bound and not self.has_changed():
            return True
        else:
            return super(UserForm, self).clean()

    def is_valid(self):
        if not self.is_bound and not self.has_changed():
            return True
        else:
            return super(UserForm, self).is_valid()

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if self.missing_password():
            raise ValidationError("Please fill out both passwords")
        if not self.empty_passwords():
            # Check that the two password entries match
            if password1 and password2 and password1 != password2:
                raise ValidationError("Passwords don't match")
        elif self.cleaned_data.get("email") and not self.is_bound:
            raise ValidationError("Please enter a password")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserForm, self).save()
        user.groups.clear()
        for group in self.cleaned_data.get('groups'):
            user.groups.add(group)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

    class Meta:
        model = User
        fields = ('email', 'is_admin', 'groups',)

class PersonForm(ModelForm):
    def __init__(self, data=None, files=None, user_form=True, instance=None):
        super(PersonForm, self).__init__(data, files, instance=instance)

        args = []
        kwargs = {}

        try:
            user = User.objects.get(person=self.instance)
        except:
            user = None

        if user_form:
            if self.data and user:
                args.append(self.data)
                kwargs['instance'] = user
            elif user:
                kwargs['instance'] = user
            elif self.data:
                args.append(self.data)

            self.user_form = UserForm(*args, **kwargs)
        else:
            self.user_form = False


    def is_valid(self):
        if self.user_form:
            return super(PersonForm, self).is_valid() and self.user_form.is_valid()
        else:
            return super(PersonForm, self).is_valid()

    def save(self, commit=True):
        person = super(PersonForm, self).save()
        if self.user_form and self.user_form.has_changed():
            user = self.user_form.save(commit=False)
            user.person = person
            if commit:
                user.save()
        return person

    class Meta:
        model = Person
        fields = '__all__'
        exclude = ('first_name', 'last_name', 'roles', 'user', 'is_admin')

class BaseImageAttachmentFormSet(BaseInlineFormSet):
    def __init__(self, *args, **kwargs):
        super(BaseImageAttachmentFormSet, self).__init__(*args, **kwargs)
        if self.instance.featured_image:
            self.queryset = ImageAttachment.objects.filter(article=self.instance).exclude(id=self.instance.featured_image.id)

class ImageAttachmentForm(ModelForm):
    class Meta:
        model = ImageAttachment
        fields = '__all__'

        widgets = {
            'caption': TextInput(attrs={
                'placeholder': 'Enter a caption',
            }),
            'image': TextInput()
        }

class FeaturedImageForm(ModelForm):
    class Meta:
        model = ImageAttachment
        fields = '__all__'

        exclude = ('article',)

        widgets = {
            'caption': TextInput(attrs={
                'placeholder': 'Enter a caption',
            }),
            'image': TextInput()
        }

class ProfileForm(ModelForm):

    password1 = CharField(label='Password', widget=PasswordInput, required=False)
    password2 = CharField(label='Password confirmation', widget=PasswordInput, required=False)

    def __init__(self, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)

        args = []
        kwargs = {}

        if self.data and self.instance.person:
            self.person_form = PersonForm(self.data, user_form=False, instance=self.instance.person)
        elif self.instance.person:
            self.person_form = PersonForm(user_form=False, instance=self.instance.person)
        elif self.data:
            self.person_form = PersonForm(self.data, user_form=False)
        else:
            self.person_form = PersonForm(user_form=False)

    def missing_password(self):
        return self.data.get('password1', False) and not self.data.get('password2', False) or not self.data.get('password1', False) and self.data.get('password2', False)

    def empty_passwords(self):
        return not self.data.get('password1', False) or self.data.get('password2', False)

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if self.missing_password():
            raise ValidationError("Please fill out both passwords")
        if not self.empty_passwords():
            # Check that the two password entries match
            if password1 and password2 and password1 != password2:
                raise ValidationError("Passwords don't match")
        return password2

    def is_valid(self):
        return super(ProfileForm, self).is_valid() and self.person_form.is_valid()

    def save(self, commit=True):
        user = super(ProfileForm, self).save(commit=False)
        if not self.empty_passwords():
            user.set_password(self.cleaned_data["password1"])
        if self.person_form.is_valid() and self.person_form.has_changed():
            person = self.person_form.save()
            user.person = person
        if commit:
            user.save()
        return user

    class Meta:
        model = User
        fields = ('email',)

class SectionForm(ModelForm):
    class Meta:
        model = Section
        fields = '__all__'

class RoleForm(ModelForm):
    class Meta:
        model = Group
        fields = '__all__'

class FileForm(ModelForm):
    class Meta:
        model = File
        fields = '__all__'

class ArticleForm(ModelForm):
    class Meta:
        model = Article
        fields = '__all__'

        exclude = ('parent', 'is_active', 'images', 'authors', 'featured_image')

        widgets = {
            'revision_id': HiddenInput(),
            'is_published': HiddenInput(),
            'headline': Textarea(attrs={
                'placeholder': 'Enter a headline',
                'class': 'headline',
                'rows': '1',
            }),
            'content': Textarea(attrs={
                'placeholder': 'Write a story...',
                'class': 'content',
            }),
            'snippet': Textarea(attrs={
                'rows': '5',
            })
        }

    # Override
    def __init__(self, *args, **kwargs):
        super(ArticleForm, self).__init__(*args, **kwargs)

        # Pass POST data into subforms if available
        if self.data and 'instance' in kwargs:
            self.featured_image_form = FeaturedImageForm(self.data, instance=self.instance.featured_image)
        elif 'instance' in kwargs:
            self.featured_image_form = FeaturedImageForm(instance=self.instance.featured_image)
        elif self.data:
            self.featured_image_form = FeaturedImageForm(self.data)
        else:
            self.featured_image_form = FeaturedImageForm()

        if self.data:
            self.save_id = self.data.get('saveid')
        else:
            self.save_id = str(uuid.uuid4())[:8]

    def is_valid(self):
        """
        Performs validation checks on self and featured image.
        Returns True if both are valid, False otherwise.
        """
        article_is_valid = super(ArticleForm, self).is_valid()
        featured_image_is_valid = self.featured_image_form.is_valid() or not self.featured_image_form.has_changed()

        return article_is_valid and featured_image_is_valid

    # Override
    def save(self, revision=True):

        is_stale, head = self.instance.check_stale()
        if is_stale:
            return head

        super(ArticleForm, self).save()

        # Save attachments
        self.instance.save_attachments()

        # Save related data (tags, topics, etc)
        self.instance.save_related(self.data)

        # Handle featured image saving
        self.save_featured_image(revision)

        # Save instance again to commit changes
        self.instance.save(update_fields=['content', 'featured_image'], revision=False)

        return self.instance

    def save_featured_image(self, revision=True):
        if self.instance.featured_image:
            self.featured_image_form.data = self.data
            if revision:
                self.instance.featured_image.pk = None
                self.featured_image_form.instance = self.instance.featured_image
        else:
            self.featured_image_form = FeaturedImageForm(self.data)
        if self.featured_image_form.is_valid():
            saved = self.featured_image_form.save()
            saved.article = self.instance
            saved.save()
            self.instance.featured_image = saved

ImageAttachmentFormSet = inlineformset_factory(Article, ImageAttachment, form=ImageAttachmentForm, formset=BaseImageAttachmentFormSet, extra=0)
