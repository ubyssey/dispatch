var React = require('react');
var DispatchTextEditor = require('./DispatchTextEditor.js');

var EditorImage = require('./embeds/EditorImage.jsx');
var EditorCode = require('./embeds/EditorCode.jsx');
var EditorVideo = require('./embeds/EditorVideo.jsx');

var Quill = require('quill/index.js');

var QuillEditor = React.createClass({
    getInitialState: function(){
        return {
            article: this.props.article,
        }
    },
    componentDidMount: function(){
        this.embeds = [];

        Quill.registerEmbed('image', EditorImage);
        Quill.registerEmbed('code', EditorCode);
        Quill.registerEmbed('video', EditorVideo);

        Quill.registerModule('dispatch', DispatchTextEditor);

        this.quill = new Quill('#article-editor');
        
        this.quill.addEmbed('image', {manager: this.props.imageManager})
        this.quill.addEmbed('code');
        this.quill.addEmbed('video');

        this.quill.addModule('toolbar', { container: '#full-toolbar' });
        this.quill.addModule('link-tooltip', true);

        this.quill.addModule('dispatch', { article: this.state.article, embeds: this.embeds, editor: this });

        this.quill.setJSON(this.state.article.content);

//        $.each(this.embeds, function(key, embed){
//            var node = $('div[data-id='+key+']');
//            this.embeds[node.attr('id')] = React.render(
//                <embed.controller {...embed.props} />,
//                node.get(0)
//            );
//        }.bind(this));

    },
    componentWillReceiveProps: function(nextProps) {
        if(nextProps.article.revision_id != this.state.article.revision_id){
            this.quill.setJSON(nextProps.article.content);
            this.setState({
              article: nextProps.article,
            })
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

var Editor = function(article, source, saveAttempt, saved, saveid) {

    var quill;

    var images = [];
    var embeds = {};

    var imageManager;

    return {
        init: function(){
            if(article){
                this.fetchImages(function(){
                    this.setupEditor();
                }.bind(this));
            } else {
                this.setupEditor();
            }
        },
        setupEditor: function(){
            quill = new Quill('#editor');

            quill.addEmbed('image');
            quill.addEmbed('code');
            quill.addEmbed('video');

            quill.addModule('dispatch', { article: article, embeds: embeds, editor: this });
            quill.addModule('toolbar', { container: '#full-toolbar' });
            quill.addModule('link-tooltip', true);

            if(saveAttempt && !saved){
                quill.setJSON(JSON.parse(sessionStorage['articleContent_'+saveid]));
            } else if (article) {
                quill.setJSON(JSON.parse($(source).text()));
                $.each(embeds, function(key, embed){
                    var node = $('div[data-id='+key+']');
                    embeds[node.attr('id')] = React.render(
                        <embed.controller {...embed.props} />,
                        node.get(0)
                    );
                });
            }
        },
        prepareSave: function(){
            var data = quill.getJSON();
            var output = JSON.stringify(data);
            // Store old content in browser cache
            sessionStorage['articleContent_'+saveid] = output;
            $(source).text(output);
        },

        processImage: function(embedId, id) {
            var attachment = images[id];
            if(typeof attachment !== 'undefined'){
                embeds[embedId] = {
                    controller: EditorImage,
                    props: {
                        images: [
                            {
                                id: id,
                                src: attachment.image.url
                            },
                        ],
                        caption: attachment.caption,
                        manager: imageManager,
                    }
                }
                return true;
            } else {
                return false;
            }
        },
        getJSON: function(){
            return quill.getJSON();
        },
        setJSON: function(data){
            return quill.setJSON(data);
        },
        getImages: function(){
            return images;
        }
    }

}

module.exports = QuillEditor;
