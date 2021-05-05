# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-10-30 18:59

from django.db import migrations, models

from dispatch.models import Article, Page, Author

def fix_latest_head(model, item):
    latest = model.objects. \
        filter(parent=item.parent). \
        order_by('-id')[0]

    model.objects. \
        filter(parent=item.parent). \
        update(head=None)

    latest.head = True
    latest.save(revision=False)

    try:
        duplicates = model.objects. \
            filter(slug=item.slug). \
            exclude(parent=item.parent). \
            delete()
    except Exception as e:
        print("Error encountered while trying to delete duplicates!\n")
        print(e)

def fix_latest_published(model, item):
    latest_items = model.objects. \
        filter(parent_id=item.parent_id, is_published=True). \
        order_by('-id')

    if not latest_items:
        return

    model.objects. \
        filter(parent=item.parent). \
        update(is_published=None)

    latest = latest_items[0]
    latest.is_published = True
    latest.save(revision=False)

def fix_items(model):
    seen = set()
    for item in model.objects.order_by('-id'):
        if item.slug in seen:
            continue

        fix_latest_head(model, item)
        fix_latest_published(model, item)

        seen.add(item.slug)

def remove_duplicates(apps, schema_editor):
    fix_items(Article)
    fix_items(Page)

class Migration(migrations.Migration):

    dependencies = [
        ('dispatch', '0024_full_name_slug_required'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='head',
            field=models.NullBooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='article',
            name='is_published',
            field=models.NullBooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='page',
            name='head',
            field=models.NullBooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='page',
            name='is_published',
            field=models.NullBooleanField(db_index=True, default=False),
        ),
        migrations.RunPython(remove_duplicates),
        migrations.AlterUniqueTogether(
            name='article',
            unique_together=set([('slug', 'head'), ('parent', 'slug', 'head')]),
        ),
        migrations.AlterUniqueTogether(
            name='page',
            unique_together=set([('slug', 'head'), ('parent', 'slug', 'head')]),
        ),
    ]
