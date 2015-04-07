var CSRF_TOKEN = $(".article-form").data('csrf');

var DispatchTextEditor = require('./components/DispatchTextEditor.js');
var EditorImage = require('./components/embeds/EditorImage.jsx');

var Editor = function(article, source, saveAttempt, saved, saveid) {

    var editor;
    var quill;
    var attachment_field = ".attachment-field";
    var selected_image;

    var images = [];
    var embeds = {};

    var CODES = {
        'image': this.processImage,
    }

    var imageManager;

    var testEmbed = function(node, embed){
        if(typeof embed.data.images === 'undefined'){
            var id = embed.data.attachment_id;
            var attachment = images[id];
            embed.data.images = [{
                id: attachment.image.id,
                src: attachment.image.url
            }];
            embed.data.caption = attachment.caption;
        }
        var controller = React.render(
            <EditorImage data={embed.data} manager={imageManager} />,
            node
        );
        return controller;
    }

    Quill.registerEmbed('image', testEmbed);

    return {
        init: function(){
            if(article){
                this.fetchImages(function(){
                    this.setupEditor();
                    this.loadAttachmentThumbs();
                }.bind(this));
            } else {
                this.setupEditor();
            }
        },
        loadAttachmentThumbs: function(){
            $('.attachment-thumb').each(function(){
                var id = $(this).data('id');
                var a = images[id];
                $(this).css('background-image', "url('"+a.image.thumb+"')");
            });
        },
        setupEditor: function(){
            quill = new Quill('#editor');

            quill.addModule('dispatch', { button: '#add_shortcode', article: article, embeds: embeds, editor: this });
            quill.addModule('toolbar', { container: '#full-toolbar' });
            quill.addModule('link-tooltip', true);

            var testCon = quill.addEmbed('image');

            if(saveAttempt && !saved){
                //quill.setHTML(sessionStorage['articleContent_'+saveid]);
                quill.setJSON(sessionStorage['articleContent_'+saveid]);
            } else {
                //quill.setHTML(this.processShortcodes($(source).text()));

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
        validCode: function(){
            return CODES.hasOwnProperty(func);
        },
        prepareSave: function(){
            var html = quill.getJSON();

            // Store old HTML in browser cache
            sessionStorage['articleContent_'+saveid] = html;

            // Store attachments list in browser cache
            // sessionStorage['articleAttachemnts_'+self.saveid] = attachm

            //var output = this.generateShortcodes(html);
            var output = JSON.stringify(html);

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
        processShortcodes: function(input) {
            var matches = [];
            var pattern = /\[[^\[\]]*\]/g;
            var n = 1;
            while (matches = pattern.exec(input)) {
                var shortcode = matches[0];
                input = input.replace(shortcode, this.processShortcode(shortcode, n));
                n += 1;
            }
            return input;
        },
        processShortcode: function(shortcode, count) {
            var pattern_func = /\[[a-z]+/g;
            var pattern_id = /[0-9]+/g;
            funcs = pattern_func.exec(shortcode)
            if (!funcs)
                return shortcode
            func = funcs[0].substring(1);
            if (!this.validCode(func))
                return shortcode
            var params = pattern_id.exec(shortcode);
            if (! params)
                return shortcode

            id = parseInt(params[0]);

            var node = '<div class="ql-embed" data-id="'+count+'"></div>';
            var replacement = this.processImage(count, id);

            if(replacement){
                return node;
            } else {
                return shortcode;
            }
        },
        setImageManager: function(manager){
            imageManager = manager;
        },
        getEmbed: function(id){
            return embeds[id];
        },
        generateShortcodes: function(input) {
            var temp = $('<div>').html(input);
            temp.find('.ql-embed').each(function(){
                var controller = embeds[$(this).attr('id')];
                $(this).replaceWith(controller.asShortcode);
            });
            return temp.html();
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
