# Page

An page represents one rendereable page for the your website, editable in the [Dispatch Manager's](../manager.md) rich text editor.

## Class Relationships

Extends `Publishable` > `django.db.models.Model`

## Properties

- `parent`: *ForeignKey Page*
- `parent_page`: *ForeignKey Page*
- `title`: *Char*

#### Inherited from `Publishable`:

- `revision_id`: *PositiveInteger*
- `head`: *Boolean*
- `is_published`: *Boolean*
- `is_active`: *Boolean*
- `slug`: *Slug*
- `shares`: *PositiveInteger*
- `views`: *PositiveInteger*
- `featured_image`: *ForeignKey ImageAttachment*
- `template`: *Char*
- `seo_keyword`: *Char*
- `seo_description`: *Text*
- `integrations`: *JSON*
- `content`: *JSON*
- `snippet`: *Text*
- `created_at`: *DateTime*
- `updated_at`: *DateTime*
- `published_at`: *DateTime*


### Property Methods

#### Inherited from `Publishable`:
- `html`: Rendered html of the article

## Methods

#### Inherited from `Publishable`:

##### `add_view`
##### `get_template_path`
##### `save_template_fields`
##### `get_template_fields`
##### `get_template`
##### `is_parent`
##### `publish`
##### `unpublish`
##### `save`
##### `save_featured_image`
##### `get_published_version`
##### `get_latest_version`
##### `get_previous_revision`
