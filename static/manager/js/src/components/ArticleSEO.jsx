var React = require('react');

var ArticleSEO = React.createClass({
  updateSEOKeyword: function(event){
    this.props.updateHandler('seo_keyword', event.target.value);
  },
    render: function(){
        return (
            <div>
                <div className="field full">
                    <label>Keywords</label>
                    <input type="text" value={this.props.seo_keyword} onChange={this.updateSEOKeyword} />
                </div>
                <div className="field full">
                    <label>Description</label>
                   <input type="text" value={this.props.seo_description} onChange={this.updateSEODescription} />
                </div>
            </div>
            );
    }
});

module.exports = ArticleSEO;