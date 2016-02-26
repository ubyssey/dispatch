var Section = require('./components/Section.jsx');

var sectionId = $('main.section').data('id');
var type = $('main.section').data('type');

React.render(
    <Section type={type} id={sectionId} />,
    document.getElementById('article-loader')
);