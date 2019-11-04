from django.utils.safestring import mark_safe

from dispatch.modules.content.embeds import embeds, EmbedException

def content_to_html(content, article_id):
    """Returns article/page content as HTML"""

    def render_node(html, node, index):
        """Renders node as HTML"""
        if node['type'] == 'paragraph':
            return html + '<p>%s</p>' % node['data']
        else:

            if node['type'] == 'ad':
                id = 'div-gpt-ad-1443288719995-' + str(10 + index) + '-' + str(article_id)
                dfp_type = 'Intra_Article_' + str(index + 1)
                size = 'banner'
                if node['data'] == 'mobile':
                    size = 'box'
                newString = '<div class="o-article-embed__advertisement"><div class="o-advertisement o-advertisment--banner o-advertisement--center"><div class="adslot" id="' + id + '" data-size="' + size + '" data-dfp="' + dfp_type + '"></div></div></div>'
                return html + '<div class="o-article-embed o-article-embed--advertisement">%s</div>\n' % newString
            try:
                if node['type'] == 'poll':
                    node['type'] = 'widget'
                    node['data']['data'] = node['data']

                if node['type'] == 'interactive map':
                    return html + node['data']['svg'] + node['data']['initScript']
                    
                return html + embeds.render(node['type'], node['data'])
            except EmbedException:
                return html

    html = ''
    index = 0
    for node in content:
        html = render_node(html, node, index)
        if (node['type'] == 'ad'):
            index += 1
    return mark_safe(html)

def content_to_json(content):
    """Returns article/page content as JSON"""

    def render_node(node):
        """Renders node as JSON"""

        if node['type'] == 'paragraph':
            return node
        else:
            return {
                'type': node['type'],
                'data': embeds.to_json(node['type'], node['data'])
            }

    return list(map(render_node, content))
