var React = require('react');
var InlineToolbar = require('./InlineToolbar.jsx');

var EditorImage = require('./embeds/EditorImage.jsx');
var EditorGallery = require('./embeds/EditorGallery.jsx');
var EditorCode = require('./embeds/EditorCode.jsx');
var EditorVideo = require('./embeds/EditorVideo.jsx');
var EditorAdvertisement = require('./embeds/EditorAdvertisement.jsx');
var EditorPullQuote = require('./embeds/EditorPullQuote.jsx');

var Quill = require('quill');
var Headers = require('./modules/Headers.js');
var HyperlinkModule = require('./modules/HyperlinkModule.jsx');

var QuillEditor = React.createClass({
    getInitialState: function(){
        return {
            article: this.props.article,
        };
    },
    componentDidMount: function(){
        Quill.registerEmbed('image', EditorImage);
        Quill.registerEmbed('gallery', EditorGallery);
        Quill.registerEmbed('code', EditorCode);
        Quill.registerEmbed('video', EditorVideo);
        Quill.registerEmbed('advertisement', EditorAdvertisement);
        Quill.registerEmbed('quote', EditorPullQuote);

        Quill.registerModule('headers', Headers);
        Quill.registerModule('inline-toolbar', InlineToolbar);
        Quill.registerModule('hyperlinks', HyperlinkModule)

        this.quill = new Quill('#article-editor', {
		  formats: ['bold', 'italic', 'underline', 'link', 'bullet', 'list']
		});

        this.quill.addEmbed('image', {manager: this.props.imageManager})
        this.quill.addEmbed('gallery', {imageManager: this.props.imageManager, galleryManager: this.props.galleryManager})
        this.quill.addEmbed('code');
        this.quill.addEmbed('video');
        this.quill.addEmbed('advertisement');
        this.quill.addEmbed('quote');

        this.quill.addModule('toolbar', { container: '#full-toolbar' });
        this.quill.addModule('inline-toolbar', true);
        this.quill.addModule('headers', true);
        this.quill.addModule('hyperlinks', true);

        if(this.state.article.content)
            this.quill.setJSON(this.state.article.content);

    },
    componentWillReceiveProps: function(nextProps){
        if(nextProps.article.revision_id != this.state.article.revision_id){
            this.quill.setJSON(nextProps.article.content);
            this.setState({
              article: nextProps.article,
            });
        }
    },
	/*
	  Remove any nodes at the end of the article JSON that
	  contain only whitespace
	*/
  	removeTrailingWhitespace : function(article) {
	  	var index = article.length;
	  	var toRemove = 0;
		while(article[index-1].match(/\s*<br>/)) {
	  	//while(article[index-1] === '<br>') {
		  	index--;
		  	toRemove++;
		}
	  	if(toRemove > 0) {
	  		article.splice(index, toRemove);
		}
	  	return article;
	},
	/*
	  Insert an inline ad after a certain number of chars iff 
	  there is an available position such that:
	    - the inserted ad is not adjacent to other media
		  (image/gallery/video/ad)
		- there are a certain number of chars after the ad
	*/
	insertInlineAds : function(article) {
		var CHARS_BEFORE_AD = 3000;
		var CHARS_AFTER_AD = 1500;
		var CENTERED_AD = {type:'advertisement',data:{alignment: 'center'}};
		var INVALID_AD_ADJACENT_TYPES = ['advertisement','image','gallery','video'];
		var beforeCharCount = 0;
		var afterCharCount = 0;
		for(var index = 0; index < article.length; index++) {
			if(typeof article[index] === 'string') {
				beforeCharCount += article[index].length;
			}
			if(beforeCharCount > CHARS_BEFORE_AD) {
				for(var inner = index; inner < article.length; inner++) {
					if(typeof article[index] === 'string') {
						afterCharCount += article[index].length;
					}
				}
				if(afterCharCount < CHARS_AFTER_AD) {
					return article;
				}
				else if(!INVALID_AD_ADJACENT_TYPES.includes(article[index-1].type) &&
				   		!INVALID_AD_ADJACENT_TYPES.includes(article[index+1].type) &&
				   		afterCharCount > CHARS_AFTER_AD) {
					article.splice(index, 0, CENTERED_AD);
					return article;
				}
			}
		}
	},
    save: function(){
		console.log(JSON.stringify(this.quill.getJSON()));
		return JSON.stringify(
			this.insertInlineAds(
			this.removeTrailingWhitespace(this.quill.getJSON())));
    },
    render: function(){
        return (
            <div id="article-editor"></div>
            )
    }
});

module.exports = QuillEditor;
