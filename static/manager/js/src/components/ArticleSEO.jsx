var React = require('react');
var Textarea = require('react-textarea-autosize');
var ArticleAdmin = require('./ArticleAdmin.jsx');


var ArticleSEO = React.createClass({
  updateSEOKeyword: function(event){
    this.props.updateHandler('seo_keyword', event.target.value);
    //console.log('Mr headline short is: ' + ArticleAdmin.short_headline );
  },
  updateSEODescription: function(event){
    this.props.updateHandler('seo_description', event.target.value);
  },
  getInitialState: function() {
    return {
      text: "",
      keyword: "",
      descriptionCount: 0
    };
  },
  handleChange: function(event) {
    this.setState({ text: event.target.value});
    this.setState({ keyword: event.target.value});
    //console.log(event.target.value);
    //console.log('Mr headline short is: ' + ArticleAdmin.article );
    console.log(  'this should be long headline: ' + JSON.stringify(this.props.article.long_headline)  );
  },
  containsHeadline: function() {

    if( typeof this.props.article.long_headline !== "undefined" && this.state.keyword !== '' ) {
      var h = this.props.article.long_headline.toLowerCase();
      var k = this.state.keyword.toLowerCase();
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
    if (this.state.keyword !== '' && typeof this.props.article.slug !== 'undefined') {
      var matcher = false;
      var slug = this.props.article.slug.split('-');
      var k = this.state.keyword.toLowerCase().split(' ');
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
                    <input type="text" value={this.props.seo_keyword} onChange={this.handleChange} />
                    <div>Your focus keyword was found in:</div>
                    <span>Article headline: { this.containsHeadline() }</span>
                    <div>Page URL: { this.containsSlug() }</div>
                </div>
                <div className="field full">
                    <label>Meta Description</label>
                    <Textarea rows={2} placeholder="Add a description" value={this.state.value} onChange={this.handleChange}></Textarea>
                    <div>Description should be 150-160 characters. {160 - this.state.text.length} chars left.</div>
                </div>
            </div>
            );
    }
});

module.exports = ArticleSEO;