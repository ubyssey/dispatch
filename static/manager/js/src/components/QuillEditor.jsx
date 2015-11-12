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
		console.log("new");
		var MIN_CHAR_LENGTH = 6000;
		var CENTERED_AD = {type:'advertisement',data:{alignment: 'center'}};
		var INVALID_AD_ADJACENT_TYPES = ['advertisement','image','gallery','video','code'];
		var beforeCharCount = 0;
		var articleCharLength = 0;
			
		for(var index in article) {
			// Only one inline ad per article
			if(article[index].type === 'advertisement') {
				return article;
			}
			if(typeof article[index] === 'string') {
				articleCharLength += article[index].length;
			}
		}
		if(articleCharLength < MIN_CHAR_LENGTH) {
				// article is too short for an inline ad
				return article;
		}
		
		for(var index = 0; index < article.length; index++) {
			if(typeof article[index]) === 'string' {
				beforeCharCount += article[index].length;
			}
			if(beforeCharCount > (articleCharLength*0.4)) {
				if(beforeCharCount < (articleCharLength*0.6)) {
					if(!INVALID_AD_ADJACENT_TYPES.includes(article[index].type) &&
					 	 		!INVALID_AD_ADJACENT_TYPES.includes(article[index-1].type)) { 
						article.splice(index, 0, CENTERED_AD);
						return article;
					}
				}
				else {
					// Ad not added, no good locations
					return article;
				}
		}
		return article;
			
		/*for(var index = 0; index < article.length; index++) {
			if(typeof article[index] === 'string') {
				beforeCharCount += article[index].length;
				console.log(article[index]);
				console.log(article[index].length);
			}
			if(article[index].type === 'advertisement') {
					beforeCharCount = 0;
			}
			if(beforeCharCount > CHARS_BEFORE_AD) {
				afterCharCount = 0;
				for(var inner = index; inner < article.length; inner++) {
					if(typeof article[inner] === 'string') {
						afterCharCount += article[inner].length;
					}
					if(afterCharCount > CHARS_AFTER_AD) {
						if(!INVALID_AD_ADJACENT_TYPES.includes(article[index-1].type) &&
				 			 !INVALID_AD_ADJACENT_TYPES.includes(article[index].type)) {
							console.log('beforeCharCount: ' + beforeCharCount);
							console.log('afterCharCount:' + afterCharCount);
							console.dir(article[index]);
							console.dir(article[index+1]);
							article.splice(index, 0, CENTERED_AD);
							beforeCharCount = 0;
							break;
						}
					}
					if(article[inner].type === 'advertisement') {
						index = inner;
						beforeCharCount = 0;
						break;
					}
				}
			}
		}
		return article;*/
	},
    save: function(){
		//console.log(JSON.stringify(this.quill.getJSON()));
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
