from django.utils.safestring import mark_safe

from dispatch.modules.content.embeds import embeds, EmbedException

def content_to_html(content):
    """Returns artilce/page content as HTML"""

    def render_node(html, node):
        """Renders node as HTML"""

        if node['type'] == 'paragraph':
            return html + '<p>%s</p>' % node['data']
        else:
            try:
                return html + embeds.render(node['type'], node['data'])
            except EmbedException:
                return html

    return mark_safe(reduce(render_node, content, ''))

def content_to_json(content):
    """Returns artilce/page content as JSON"""

    def render_node(node):
        """Renders node as JSON"""

        if node['type'] == 'paragraph':
            return node
        else:
            return {
                'type': node['type'],
                'data': embeds.to_json(node['type'], node['data'])
            }

    return map(render_node, content)
