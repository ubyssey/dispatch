var React = require('react');

var SelectField = React.createClass({
    render: function(){
        var options = this.props.field.options.map(function(option, i){
            return ( <option key={i} value={option[0]}>{option[1]}</option> );
        });
        return (
            <div className="field">
                <label>{this.props.field.label}</label>
                <select>{options}</select>
            </div>
            );
    }
});

module.exports = SelectField;

