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
        //Quill.registerEmbed('code', EditorCode);
        Quill.registerEmbed('video', EditorVideo);
        Quill.registerEmbed('advertisement', EditorAdvertisement);
        Quill.registerEmbed('quote', EditorPullQuote);

        Quill.registerModule('headers', Headers);
        Quill.registerModule('inline-toolbar', InlineToolbar);
        Quill.registerModule('hyperlinks', HyperlinkModule)

        this.quill = new Quill('#article-editor');

        this.quill.addEmbed('image', {manager: this.props.imageManager})
        this.quill.addEmbed('gallery', {imageManager: this.props.imageManager, galleryManager: this.props.galleryManager})
        //this.quill.addEmbed('code');
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
    save: function(){
        return JSON.stringify(this.quill.getJSON());
    },
    render: function(){
        return (
            <div id="article-editor"></div>
            )
    }
});

module.exports = QuillEditor;
