var React = require('react');
var Slug = require('react-slug');

var SlugField = React.createClass({
    render: function(){
        return (
            <div className="slug-field" >
                <div className="url">{this.props.url}</div>
                <Slug value={this.props.value} onChange={this.props.onChange} tabIndex={this.props.tabIndex} className={this.props.errorClass} />
            </div>
            )
    }
});

module.exports = SlugField;

