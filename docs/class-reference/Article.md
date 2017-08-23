# Article

An article represents one publishable written work, editable in the [Dispatch Manager's](../manager.md) rich text editor.

## Class Relationships

Extends `Publishable` > `django.db.models.Model`

## Properties

- `parent`: *ForeignKey Article*
- `headline`: *Char*
- `section`: *ForeignKey Section*
- `authors`: *ManyToMany Person*
- `topic`: *ForeignKey Topic*
- `tags`: *ManyToMany Tag*
- `importance`: *PositiveInteger (1 - 6)*
- `reading_time`: *Char ('anytime', 'morning', 'midday', or 'evening')*
- `objects`: *ArticleManager*

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

- `title`: Title of the article

#### Inherited from `Publishable`:
- `html`: Rendered html of the article

## Methods

##### `get_authors`
##### `get_related`
##### `get_reading_list`
##### `save_tags`
##### `save_topic`
##### `save_authors`
##### `get_author_string`
Returns list of authors as a comma-separated string (with 'and' before last author).
##### `get_author_url`
Returns list of authors (including hyperlinks) as a comma-separated string (with 'and' before last author).
##### `get_absolute_url`
Returns article URL.

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
