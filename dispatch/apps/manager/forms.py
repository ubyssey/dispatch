from django.forms import ModelForm, TextInput, Textarea
from django.forms.models import inlineformset_factory
from dispatch.apps.content.models import Article, Attachment, ImageAttachment

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