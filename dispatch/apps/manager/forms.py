from django.forms import ModelForm, TextInput, Textarea
from dispatch.apps.content.models import Article

class ArticleForm(ModelForm):
    class Meta:
        model = Article
        fields = '__all__'

        exclude = ('images', 'authors', )

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