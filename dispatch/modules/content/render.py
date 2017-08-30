from django.utils.safestring import mark_safe

from dispatch.modules.content.embeds import embedlib

def content_to_html(content):
    """Returns artilce/page content as HTML"""

    def render_node(html, node):
        """Renders node as HTML"""

        if node['type'] == 'paragraph':
            return html + '<p>%s</p>' % node['data']
        else:
            return html + embedlib.render(node['type'], node['data'])

    return mark_safe(reduce(render_node, content, ''))
