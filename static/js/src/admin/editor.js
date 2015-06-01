var CSRF_TOKEN = $(".article-form").data('csrf');

var React = require('react');
var EditorImage = require('./components/embeds/EditorImage.jsx');
var EditorCode = require('./components/embeds/EditorCode.jsx');
var EditorVideo = require('./components/embeds/EditorVideo.jsx');

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
        fetchImages: function(callback){
            dispatch.articleAttachments(article, function(data){
                $.each(data.results, function(key, obj){
                    images[obj.id] = obj;
                });
                callback();
            });
        },
        setImageManager: function(manager){
            imageManager = manager;
        },
        setupEmbeds: function(){
            Quill.registerEmbed('image', EditorImage(imageManager, images));
            Quill.registerEmbed('code', EditorCode);
            Quill.registerEmbed('video', EditorVideo);
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

module.exports = Editor;
