var React = require('react');
var Textarea = require('react-textarea-autosize');
var ArticleAdmin = require('./ArticleAdmin.jsx');


var ArticleSEO = React.createClass({
    handleChange: function(field, event) {
        this.props.updateHandler(field, event);
    },
    containsHeadline: function() {
        if( this.props.article.long_headline && this.props.seo_keyword) {
            var h = this.props.article.long_headline.toLowerCase();
            var k = this.props.seo_keyword.toLowerCase();
            var splitHeadline = h.split(' ');
            var splitKeyword  = k.split(' ');
            var matcher = false;
            for (var l = 0; l < splitKeyword.length; l++ ) {

                for (var i = 0; i < splitHeadline.length; i++) {
                    if (splitHeadline[i] === splitKeyword[l] ) {
                        matcher = true;
                        return "yes";
                    }
                }

            }
            if (matcher === false) {
                return "no";
            }
        } else {
            return "no";
        }
    },
    containsSlug: function() {
        if (this.props.seo_keyword && this.props.article.slug) {
            var matcher = false;
            var slug = this.props.article.slug.split('-');
            var k = this.props.seo_keyword.toLowerCase().split(' ');
            for (var i = 0; i < slug.length; i++) {
                if (slug[i] === k) {
                    console.log( k );
                    matcher = true;
                    return "yes";
                }
            }
            for (var l = 0; l < k.length; l++) {
                for (var i = 0; i < slug.length; i++) {
                    if (slug[i] === k[l] ) {
                        console.log( k[l] );
                        matcher = true;
                        return "yes";
                    }
                }
            }
            if (matcher === false) {
                console.log( k );
                return 'no';
            }
        } else {
            console.log( k );
            return "no";
        }
    },
    render: function(){
        return (
            <div>
                <div className="field full">
                    <label>Focus Keywords</label>
                    <input type="text" value={this.props.seo_keyword} onChange={this.handleChange.bind(this, 'seo_keyword')} />
                    <div>Your focus keyword was found in:</div>
                    <span>Article headline: { this.containsHeadline() }</span>
                    <div>Page URL: { this.containsSlug() }</div>
                </div>
                <div className="field full">
                    <label>Meta Description</label>
                    <Textarea rows={2} placeholder="Add a description" value={this.props.seo_description} onChange={this.handleChange.bind(this, 'seo_description')}></Textarea>
                    <div>Description should be 150-160 characters. {160 - (this.props.seo_description ? this.props.seo_description.length : 0)} chars left.</div>
                </div>
            </div>
            );
    }
});

module.exports = ArticleSEO;