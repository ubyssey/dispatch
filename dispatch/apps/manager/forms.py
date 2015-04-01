from django.forms import ModelForm, TextInput, Textarea, CharField, PasswordInput, ValidationError, HiddenInput
from django.forms.models import inlineformset_factory, BaseInlineFormSet
from dispatch.apps.content.models import Resource, Article, Image, ImageAttachment
from dispatch.apps.core.models import User, Person
import uuid

class PersonForm(ModelForm):
    class Meta:
        model = Person
        fields = '__all__'

        exclude = ('roles', 'user')

class UserForm(ModelForm):

    password1 = CharField(label='Password', widget=PasswordInput)
    password2 = CharField(label='Password confirmation', widget=PasswordInput)

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

    class Meta:
        model = User
        fields = '__all__'

        exclude = ('password',)

UserFormSet = inlineformset_factory(Person, User, form=UserForm, extra=0)

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

class ArticleForm(ModelForm):
    class Meta:
        model = Article
        fields = '__all__'

        exclude = ('parent', 'is_active', 'images', 'authors', 'featured_image')

        widgets = {
            'revision_id': HiddenInput(),
            'long_headline': Textarea(attrs={
                'placeholder': 'Enter a headline',
                'class': 'headline',
                'rows': '1',
            }),
            'content': Textarea(attrs={
                'placeholder': 'Write a story...',
                'class': 'content',
            }),
        }

    # Override
    def __init__(self, *args, **kwargs):
        super(ArticleForm, self).__init__(*args, **kwargs)

        # Pass POST data into subforms if available
        if self.data and 'instance' in kwargs:
            self.attachments_form = ImageAttachmentFormSet(self.data, instance=self.instance)
            self.featured_image_form = FeaturedImageForm(self.data, instance=self.instance.featured_image)
        elif 'instance' in kwargs:
            self.attachments_form = ImageAttachmentFormSet(instance=self.instance)
            self.featured_image_form = FeaturedImageForm(instance=self.instance.featured_image)
        elif self.data:
            self.attachments_form = ImageAttachmentFormSet(self.data)
            self.featured_image_form = FeaturedImageForm(self.data)
        else:
            self.attachments_form = ImageAttachmentFormSet()
            self.featured_image_form = FeaturedImageForm()

        if self.data:
            self.save_id = self.data.get('saveid')
        else:
            self.save_id = str(uuid.uuid4())[:8]

    def is_valid(self):
        """
        Performs validation checks on self, attachments and featured image.
        Returns True if all three are valid, False otherwise.
        """
        article_is_valid = super(ArticleForm, self).is_valid()
        attachments_is_valid = self.attachments_form.is_valid() or not self.attachments_form.has_changed()
        featured_image_is_valid = self.featured_image_form.is_valid() or not self.featured_image_form.has_changed()

        return article_is_valid and attachments_is_valid and featured_image_is_valid

    # Override
    def save(self, revision=True):

        is_stale, head = self.instance.check_stale()
        if is_stale:
            return head

        super(ArticleForm, self).save()

        # Save related data (tags, topics, etc)
        self.instance.save_related(self.data)

        # Handle featured image saving
        self.save_featured_image(revision)

        # Handle image attachments saving
        self.save_attachments(revision)

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

    def save_attachments(self, revision=True):
        if self.attachments_form.is_valid():
            attachments = self.attachments_form.save()
            if attachments:
                self.instance.save_new_attachments(attachments)
        self.instance.clear_old_attachments()


ImageAttachmentFormSet = inlineformset_factory(Article, ImageAttachment, form=ImageAttachmentForm, formset=BaseImageAttachmentFormSet, extra=0)