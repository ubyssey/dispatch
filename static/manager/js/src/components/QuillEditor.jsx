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
	  Insert an inline ad after a certain number of words iff 
	  there is an available position such that:
	    - the inserted ad is not adjacent to other media
		  (image/gallery/video/ad)
		- there are a certain number of words after the ad
	*/
	insertInlineAds : function(article) {
		var WORDS_BEFORE_AD = 400;
		var WORDS_AFTER_AD = 200;
		var INVALID_AD_ADJACENT_TYPES = ['advertisement','image','gallery','video'];
		var beforeWordCount = 0;
		var afterWordCount = 0;
		for(var index = 0; index < article.length; index++) {
			if(typeof article[index] === 'string') {
				beforeWordCount += article[index].length/6;
			}
			if(beforeWordCount > WORD_LIMIT_BEFORE_AD) {
				// check to ensure that adjacent nodes are not image/gallery/video/ad
				// check to ensure that there are more than 200 words after this node
				for(var inner = index; inner < article.length; inner++) {
					if(typeof article[index] === 'string') {
						afterWordCount += article[index].length/6;
					}
				}
				if(afterWordCount < WORDS_AFTER_AD) {
					return article;
				}
				else if(!INVALID_AD_ADJACENT_TYPES.includes(article[index-1]) &&
				   		!INVALID_AD_ADJACENT_TYPES.includes(article[index+1]) &&
				   		afterWordCount > WORDS_AFTER_AD) {
					article.splice(index, 0, {type:'advertisement',data:{}});
						return article;
					}
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
