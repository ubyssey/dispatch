var React = require('react');
var Textarea = require('react-textarea-autosize');

var ArticleSEO = React.createClass({
    handleChange: function(field, event) {
        this.props.updateHandler(field, event);
    },
    containsHeadline: function() {
        if( this.props.instance.headline && this.props.instance.seo_keyword) {
            var h = this.props.instance.headline.toLowerCase();
            var k = this.props.instance.seo_keyword.toLowerCase();
            var splitHeadline = h.split(' ');
            var splitKeyword  = k.split(' ');
            for (var l = 0; l < splitKeyword.length; l++ ) {
                for (var i = 0; i < splitHeadline.length; i++) {
                    if (splitHeadline[i] === splitKeyword[l] ) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    containsSlug: function() {
        if (this.props.instance.seo_keyword && this.props.instance.slug) {
            var slug = this.props.instance.slug.split('-');
            var k = this.props.instance.seo_keyword.toLowerCase().split(' ');
            for (var i = 0; i < slug.length; i++) {
                if (slug[i] === k) {
                    return true;
                }
            }
            for (var l = 0; l < k.length; l++) {
                for (var i = 0; i < slug.length; i++) {
                    if (slug[i] === k[l] ) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    render: function(){
        return (
            <div>
                <div className="field full">
                    <label>Focus Keywords</label>
                    <input type="text" value={this.props.instance.seo_keyword} onChange={this.handleChange.bind(this, 'seo_keyword')} />
                    <div>Your focus keyword was found in:</div>
                    <span>Article headline: { this.containsHeadline() ? "yes" : "no" }</span>
                    <div>Page URL: { this.containsSlug() ? "yes" : "no" }</div>
                </div>
                <div className="field full">
                    <label>Meta Description</label>
                    <Textarea rows={2} placeholder="Add a description" value={this.props.instance.seo_description} onChange={this.handleChange.bind(this, 'seo_description')}></Textarea>
                    <div>Description should be 150-160 characters. {160 - (this.props.instance.seo_description ? this.props.instance.seo_description.length : 0)} chars left.</div>
                </div>
            </div>
            );
    }
});

module.exports = ArticleSEO;