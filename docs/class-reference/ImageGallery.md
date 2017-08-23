# ImageGallery

An image gallery, editable in the [Dispatch Manager's](../manager.md) rich text editor.

## Class Relationships

Extends `django.db.models.Model`

## Properties

- `title`: *Char*
- `images`: *ManyToMany ImageAttachment*
- `created_at`: *DateTime*
- `updated_at`: *DateTime*

## Methods

##### `save_attachments`
