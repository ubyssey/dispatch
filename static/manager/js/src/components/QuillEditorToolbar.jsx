var React = require('react');

var toolbar = (
    <div id="full-toolbar" className="toolbar ql-toolbar ql-snow">
        <span className="ql-format-group">
            <span title="Bold" className="ql-format-button ql-bold"><i className="fa fa-bold"></i></span>
            <span title="Italic" className="ql-format-button ql-italic"><i className="fa fa-italic"></i></span>
            <span title="Underline" className="ql-format-button ql-underline"><i className="fa fa-underline"></i></span>
        </span>
        <span className="ql-format-group">
            <span title="Bullet" className="ql-format-button ql-bullet"><i className="fa fa-list-ul"></i></span>
        </span>
    </div>
    );

module.exports = toolbar;