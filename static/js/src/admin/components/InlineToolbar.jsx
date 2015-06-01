var React = require('react');

var InlineToolbar = React.createClass({
    render: function(){
        return (
            <div>
                <div className="side-button">
                    <button className="tb-toolbar"><span>+</span></button>
                </div>
                <div className="toolbar"></div>
            </div>
            )
    }
});

module.exports = InlineToolbar;
