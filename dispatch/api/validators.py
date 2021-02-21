import json

from rest_framework.exceptions import ValidationError
from dispatch.theme.exceptions import InvalidField, TemplateNotFound
from django.contrib.contenttypes.models import ContentType

from django.contrib.auth.password_validation import validate_password

from dispatch.api.exceptions import InvalidFilename, InvalidGalleryAttachments
from dispatch.models import Image, Person, Section, Page, Subsection, Article

class PasswordValidator(object):
    def __init__(self, confirm_field):
        self.confirm_field = confirm_field

    def set_context(self, serializer_field):
        self.data = serializer_field.parent.initial_data
        self.instance = serializer_field.parent.instance

    def __call__(self, value):
        if value != self.data.get(self.confirm_field):
            raise ValidationError('Passwords do not match')

        validate_password(value, user=self.instance)

def all_ascii(s):
    return all(ord(c) < 128 for c in s)

def FilenameValidator(value):
    if not all_ascii(value.name):
        raise InvalidFilename('The filename cannot contain non-ASCII characters')

def ImageGalleryValidator(data):
    for attachment in data:
        try:
            Image.objects.get(pk=attachment['image_id'])
        except Image.DoesNotExist:
            raise InvalidGalleryAttachments('One or more images does not exist')
        except KeyError:
            raise InvalidGalleryAttachments('One or more image ids were not provided')

class SlugValidator(object):
    def set_context(self, serializer_field):
        self.instance = serializer_field.parent.instance
        self.model = serializer_field.parent.Meta.model

    def __call__(self, slug):
        if self.model.__name__ == 'Subsection':
            self.validate_subsection_slug(slug)
        elif self.instance is None:
            if self.model.objects.filter(slug=slug).exists():
                raise ValidationError('%s with slug \'%s\' already exists.' % (self.model.__name__, slug))
        else:
            if self.model.objects.filter(slug=slug).exclude(parent=self.instance.parent).exists():
                raise ValidationError('%s with slug \'%s\' already exists.' % (self.model.__name__, slug))

    def validate_subsection_slug(self, slug):
        if Section.objects.filter(slug=slug).exists():
            raise ValidationError('A section with that slug already exists.')
        if Page.objects.filter(slug=slug).exists():
            raise ValidationError('A page with that slug already exists')

        if self.instance is None:
            if self.model.objects.filter(slug=slug).exists():
                raise ValidationError('%s with slug \'%s\' already exists.' % (self.model.__name__, slug))
        else:
            if self.model.objects.filter(slug=slug).exclude(id=self.instance.id):
                raise ValidationError('%s with slug \'%s\' already exists.' % (self.model.__name__, slug))

# def SectionValidator(section_id, subsection_id, template, tags):
#     from dispatch.theme import ThemeManager
    
#     errors = {}

#     section = Section.objects.get(id=section_id)

#     if (section.slug == 'magazine'):
#         if template is not None:
#             try:
#                 template = ThemeManager.Templates.get(template)
#             except TemplateNotFound as e:
#                 errors['template'] = str(e)

#             if ('magazine' not in template.id):
#                 errors['section_id'] = 'Articles in section magazine must have a magazine template'
#     if errors:
#         raise ValidationError(errors)

class AuthorValidator(object):
    def __init__(self, required):
        self.required = required
    def __call__(self, data):
        """Raise a ValidationError if data does not match the author format."""
        if self.required and len(data) <= 0:
            raise ValidationError('An author is required')

        if not isinstance(data, list):
            # Convert single instance to a list
            data = [data]

        AUTHOR_TYPES = {'author', 'photographer', 'illustrator', 'videographer'}

        for author in data:
            if 'person' not in author:
                raise ValidationError('An author must contain a person.')
            if 'type' in author:
                if isinstance(author, dict):
                    if not isinstance(author['type'], str) or author['type'].lower() not in AUTHOR_TYPES:
                        raise ValidationError('The author type must be a string, matching a predefined type.')
                elif isinstance(author, str):
                    tokens = author.split('"')
                    for i in range(0, len(tokens)):
                        if 5 + 6 * i < len(tokens):
                            author_type = tokens[5 + 6 * i]
                            if author_type.lower() not in AUTHOR_TYPES:
                                raise ValidationError('The author type must be a string, matching a predefined type.')

def TemplateValidator(template, template_data, tags, subsection_id):

    from dispatch.theme import ThemeManager

    errors = {}

    if template is not None:
        try:
            template = ThemeManager.Templates.get(template)
        except TemplateNotFound as e:
            errors['template'] = str(e)

        if template.id == 'food-insecurity':
            for field in template.fields:
                try:
                    field.validate(template_data.get(field.name))
                except KeyError:
                    pass
                except InvalidField as e:
                    if (field.name == 'next_article'):
                        continue
                    if (field.name == 'article_first'):
                        continue
                    if (field.name == 'article_second'):
                        continue
                    if (field.name == 'article_third'):
                        continue
                    else:
                        errors[field.name] = str(e)
        
        else:
            for field in template.fields:
                try:
                    field.validate(template_data.get(field.name))
                except KeyError:
                    pass
                except InvalidField as e:
                    if (field.name == 'byline_2'):
                        continue
                    else:
                        errors[field.name] = str(e)
            if 'magazine' in template.id:
                if tags:
                    # check for instance of year tag
                    if not True in ['20' in tag.name for tag in tags]:
                        errors['tag_ids'] = 'Must have the magazine year as a tag (e.g., "2019")'
                    else: 
                        year = [tag for tag in tags if '20' in tag.name][0].name
                        if year == '2019' and subsection_id is None:
                            errors['subsection'] = 'Must tag magazine subsection'
                else:    
                    errors['tag_ids'] = 'Must tag magazine year (e.g., "2019")'

            if template.id == 'timeline':
                if tags:
                    if not True in ['timeline-' in tag.name for tag in tags]:
                        errors['tag_ids'] = 'Must have a corresponding timeline tag'
                else:
                    errors['tag_ids'] = 'Must have a corresponding timeline tag'

        
    
    if errors:
        raise ValidationError(errors)
