var Section = require('./components/Section.jsx');

var sectionId = $('main.section').data('id');

React.render(
    <Section id={sectionId} />,
    document.getElementById('article-loader')
);