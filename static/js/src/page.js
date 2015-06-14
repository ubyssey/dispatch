var React = require('react');
var PageEditor = require('./components/PageEditor.jsx');

$(function(){
    var container = $('#page-editor');
    var slug = container.data('slug');
    React.render(
        <PageEditor slug={slug} />,
        container.get(0)
    );
});