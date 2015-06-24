var React = require('react');

var TextField = React.createClass({
    render: function(){
        return (
            <div className="field full">
                <label>{this.props.field.label}</label>
                <input type="text" />
            </div>
            );
    }
});

module.exports = TextField;

