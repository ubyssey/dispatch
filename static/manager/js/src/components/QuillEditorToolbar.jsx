var React = require('react');

var toolbar = (
    <div id="full-toolbar" className="toolbar ql-toolbar ql-snow">
        <span className="ql-format-group">
            <span title="Bold" className="ql-format-button ql-bold"><i className="fa fa-bold"></i></span>
            <span title="Italic" className="ql-format-button ql-italic"><i className="fa fa-italic"></i></span>
            <span title="Underline" className="ql-format-button ql-underline"><i className="fa fa-underline"></i></span>
            <span title="H1" data-size="H1" className="ql-format-button ql-header H1"><span>H1</span></span>
            <span title="H2" data-size="H2" className="ql-format-button ql-header H2"><span>H2</span></span>
            <span title="H3" data-size="H3" className="ql-format-button ql-header H3"><span>H3</span></span>
        </span>
        <span className="ql-format-group">
            <span title="Bullet" className="ql-format-button ql-bullet"><i className="fa fa-list-ul"></i></span>
        </span>
    </div>
    );

module.exports = toolbar;