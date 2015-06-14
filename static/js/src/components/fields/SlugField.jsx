var React = require('react');
var Slug = require('react-slug');

var SlugField = React.createClass({
    render: function(){
        return (
            <div className="slug-field">
                <div className="url">{this.props.url}</div>
                <Slug value={this.props.value} onChange={this.props.onChange} />
            </div>
            )
    }
});

module.exports = SlugField;

