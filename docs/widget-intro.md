# Widgets

 Widgets enable a very high level of customization, that, once setup, allow anyone to reorganize or change the website!

 Widgets are placed into zones (or articles, or even other widgets!), and a zone may accept multiple types of widgets.

 When designing your website, try to place zones in key places where it makes sense to be able to change the content quickly and easily. For example you could design your homepage to be a grid of widgets. Then each tile on the grid can be easily swapped out in the future with no coding!

## Creating a Zone

Defining a zone is simple. Create a file in your project module called `zones.py`. Be sure that it gets loaded with your project.

For example in `urls.py`:

```python
import zones
```

in `zones.py`:

```python
from dispatch.theme import register
from dispatch.theme.widgets import Zone

@register.zone
class FrontPage(Zone):
    id = 'frontpage'
    name = 'FrontPage'
```

The decorator registers the zone so that it will appear in the [Dispatch Manager](./manager.md)

The `id` will be used to reference it in the future, and the `name` what will display in the manager.

## Creating a Widget

Create another file called `widgets.py`:

```python
from dispatch.theme.fields import (WidgetField, CharField, TextField,
                                   DateTimeField, IntegerField, BoolField,
                                   ArticleField, ImageField)

from zones import FrontPage

@register.widget
class DefaultFrontPage(Widget):
    # Required
    id = 'default-frontpage'
    name = 'Default Front Page'
    template = 'widgets/frontpage/default.html'
    zones = [FrontPage]

    # Customizable
    phrase = CharField('Phrase of the day!')
```

Similar to zones, widgets has an id and name. They also take a `template`, that will be used to render it, and a list of `zones` that it is compatible with.

Widgets can be customized by adding various fields that can be edited in the dispatch manager.

All custom fields will be passed into the rendering context. In the case of this widget, it's template could look like this:

`templates/widgets/frontpage/default.html`:

```html
<div class="frontpage-default">
  <div class="phrase-ofthe-day">{{ phrase }}</div>
</div>
```

### Extending Context

You can extend the context of a widget using arbitrary python code, just like in a view. Simply override the context method.

```python
from myapi import make_a_call

@register.widget
class DefaultFrontPage(Widget):
    id = 'default-frontpage'
    name = 'Default Front Page'
    template = 'widgets/frontpage/default.html'
    zones = [FrontPage]

    phrase = CharField('Phrase of the day!')

    def context(self, result):
      # at this point, result['phrase'] will contain
      # the value set in the dispatch manager
      # so feel free to use the values set as inputs to your widget code!

      try:
        my_data = make_a_call()
      except:
        my_data = None

      result['my_data'] = my_data
      return result
```

## Field Reference
