from django.forms import ModelForm, TextInput, Textarea
from django.forms.models import inlineformset_factory, BaseInlineFormSet
from dispatch.apps.content.models import Resource, Article, Image, ImageAttachment


class BaseImageAttachmentFormSet(BaseInlineFormSet):
    def __init__(self, *args, **kwargs):
        super(BaseImageAttachmentFormSet, self).__init__(*args, **kwargs)
        if self.instance:
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

        exclude = ('is_active', 'images', 'authors', 'featured_image')

        widgets = {
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
        if self.data:
            self.attachments_form = ImageAttachmentFormSet(self.data, instance=self.instance)
            self.featured_image_form = FeaturedImageForm(self.data, instance=self.instance.featured_image)
        else:
            self.attachments_form = ImageAttachmentFormSet(instance=self.instance)
            self.featured_image_form = FeaturedImageForm(instance=self.instance.featured_image)

    def is_valid(self):
        """
        Performs validation checks on self, attachments and featured image.

        Returns True if all three are valid, False otherwise.
        """
        article_is_valid = super(ArticleForm, self).is_valid()
        attachments_is_valid = self.attachments_form.is_valid()
        featured_image_is_valid = self.featured_image_form.is_valid()

        return article_is_valid and attachments_is_valid and featured_image_is_valid

    # Override
    def save(self):

        # Save related data (tags, topics, etc)
        self.instance.save_related(self.data)

        # Handle featured image saving
        self.save_featured_image()

        # Handle image attachments saving
        self.save_attachments()

        return super(ArticleForm, self).save()


    def save_featured_image(self):
        self.featured_image_form = FeaturedImageForm(self.data)
        if self.featured_image_form.has_changed() and self.featured_image_form.is_valid():
            self.instance.featured_image = self.featured_image_form.save()

    def save_attachments(self):
        if self.attachments_form.has_changed() and self.attachments_form.is_valid():
            attachments = self.attachments_form.save()
            if attachments:
                self.instance.content = self.instance.save_new_attachments(attachments)
        self.instance.clear_old_attachments()

ImageAttachmentFormSet = inlineformset_factory(Article, ImageAttachment, form=ImageAttachmentForm, formset=BaseImageAttachmentFormSet, extra=0)