var React = require('react');

var SelectField = React.createClass({
    render: function(){
        var options = this.props.options.map(function(option, i){
            return ( <option key={i} value={option[0]}>{option[1]}</option> );
        });
        return (
            <div className="field">
                <label>{this.props.label}</label>
                <select value={this.props.value} onChange={this.props.updateHandler}>{options}</select>
            </div>
            );
    }
});

module.exports = SelectField;

