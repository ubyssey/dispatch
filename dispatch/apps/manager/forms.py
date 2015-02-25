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
            'featured_image': TextInput(),
        }

class FeaturedImageForm(ModelForm):
    class Meta:
        model = ImageAttachment
        fields = '__all__'

        exclude = ('article',)

        widgets = {
            'image': TextInput()
        }


ImageAttachmentFormSet = inlineformset_factory(Article, ImageAttachment, form=ImageAttachmentForm, formset=BaseImageAttachmentFormSet, extra=0)