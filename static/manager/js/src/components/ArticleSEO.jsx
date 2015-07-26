var React = require('react');

var ArticleSEO = React.createClass({
  updateSEOKeyword: function(event){
    this.props.updateHandler('seo_keyword', event.target.value);
  },
    render: function(){
        return (
            <div className="field full">
                <label>SEO Keyword</label>
                <input type="text" value={this.props.seo_keyword} onChange={this.updateSEOKeyword} />
            </div>
            );
    }
});

module.exports = ArticleSEO;