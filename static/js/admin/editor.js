var Shortcode = function(quill, options) {
    var self = this;
    this.quill = quill;
    this.options = options;
    this.button = $(options.button);
    this.article = options.article;
    this.inlineEditorOpen = false;
    this.lastIndex;

    // set text
    //this.quill.setHTML($('textarea.content').text());

    var inlineToolbar = this.quill.addContainer('inline-toolbar');
    var imageTools = this.quill.addContainer('image-tools');

    $(imageTools).html($('#image-tools').html());
    $(inlineToolbar).html($('#inline-toolbar').html());
    this.quill.addFormat('cssClass', {
        class: 'format-',
    });

    this.quill.addFormat('pull_quote', {
        tag: 'DIV',
        prepare: 'test'
    })

    $('.inline-toolbar .tb-toolbar').click(function(e){
        e.preventDefault();
        this.inlineEditorOpen = true;
        $('.inline-toolbar .toolbar').show();
        self.quill.setSelection();
    });

    $('.set-featured-image').imageModal(function(items){
        var image = items[0];
        $('#id_image').val(image.id);
        $('img.featured-image').attr("src", "http://dispatch.dev:8888/media/"+image.url);
    });

    $('.tb-image').imageModal(function(items){
        $.each(items, function(key, image){
        if(images.indexOf(image) == -1){
            var attachment = new Attachment(self.article, image);
            attachment.save(function(data){
                self.addImage("http://dispatch.dev:8888/media/"+image.url, data.id);
                self.updateSource();
                images.push(attachment);
            });
            }
        });
    });

    $(document).on("click", ".ql-line img", function(){
        $(this).parent().remove();
    });

    self.button.click(function(){
        self.update();
    })

    quill.on('text-change', function (delta, source) {
        self.inlineToolbar();
        if (source == 'user') {
            self.highlightText();
        }
    });

    quill.on('selection-change', function(range) {
        self.inlineToolbar();
    });
}

Shortcode.prototype.update = function(){
    this.quill.focus();
    var range = this.quill.getSelection();
    var code = '[snippet "test_snippet"]';
    if (range.start == range.end){
        this.quill.insertText(range.start, code, 'cssClass', 'shortcode');
    } else {
        this.quill.deleteText(range.start, range.end);
        this.quill.insertText(range.start, code, 'cssClass', 'shortcode');
    }
}

Shortcode.prototype.highlightText = function () {
    //var text = this.quill.getText(),
    //    hashRegex = /(\[.*\])/ig,
    //    match;

    //this.quill.formatText(0, this.quill.getLength(), 'cssClass', false);

    $('textarea.content').html(this.quill.getHTML());

    //while (match = hashRegex.exec(text)) {
    //    this.quill.formatText(match.index, match.index + match[0].length, 'pull_quote', true);
    //}
}

Shortcode.prototype.updateSource = function() {
    $('textarea.content').html(this.quill.getHTML());
}

Shortcode.prototype.inlineToolbar = function() {

    var range = this.quill.getSelection();

    if(range == null || range.start != range.end)
        return false

    var curLine = this.quill.editor.doc.findLineAt(range.start);

    if(curLine[0]['length'] == 1){
        var lineData = curLine[0];
        var id = lineData.id;
        var offset = $('#'+id).position().top;
        this.lastIndex = range.start;
        $('.inline-toolbar .toolbar').hide();
        $('.inline-toolbar').css('top', offset).show();
    } else {
        this.closeInlineToolbar();
    }
}

Shortcode.prototype.closeInlineToolbar = function() {
    $('.inline-toolbar .toolbar').hide();
    $('.inline-toolbar').hide();
}

Shortcode.prototype.addImage = function(src, id) {
    var lastLine = this.quill.getLength() - 1 == this.lastIndex;
    var options = {
        'src': src,
        'data-id': id,
        'class': 'dis-image',
    }
    this.quill.insertEmbed(this.lastIndex, 'image', options);
    //this.quill.insertText(this.lastIndex, '<img class="dis-image" data-id="' + id + '" src="' + src + '" />');
    $("#editor").find()
    this.closeInlineToolbar();
    if(lastLine)
        this.quill.editor.doc.appendLine(document.createElement('P'));
}

Quill.registerModule('shortcode', Shortcode);


function Editor() {

    this.CODES = {
        'image': this.processImage,
    }
    this.images = {};
    this.quill;
    this.article;
    this.source;
    this.attachment_field = ".attachment-field";

    var self = this;

    var selected_image;

    $(document).on("click", "#remove-image", function(e){
        console.log(selected_image);
        e.preventDefault();
        $('.image-tools').hide();
        $(selected_image).remove();
    });

    $(document).on("mouseover", ".ql-line img", function(){
        selected_image = this;
        var image_id = $(this).data("id");
        var image = self.images[image_id];
        var offset = $(this).position().top;
        $('.image-tools').width($(this).width()).height($(this).height());
        $('.image-tools').css('top', offset).show();
        $('.image-tools .caption').text(image.caption);
    });

    $(document).on("mouseleave", ".image-tools", function(){
        $(this).hide();
    });

    this.init = function(article, source) {
        this.article = article;
        this.source = source;
        if(article){
            this.fetchImages(function(){
                self.setupEditor();
            });
        } else {
            self.setupEditor();
        }
    }

    this.setupEditor = function(){
        self.quill = new Quill('#editor');
        self.quill.addModule('shortcode', { button: '#add_shortcode', article: self.article });
        self.quill.addModule('toolbar', { container: '#full-toolbar' });
        self.quill.addModule('link-tooltip', true);
        var processed = self.processShortcodes($(self.source).text());
        self.quill.setHTML(processed);
    }

    this.validCode = function(func){
        return this.CODES.hasOwnProperty(func);
    }

    this.prepareSave = function(){
        var html = self.quill.getHTML();
        var output = self.generateShortcodes(html);
        $(self.attachment_field).val(output.attachments.join(","));
        $(self.source).text(output.html);
    }

    this.fetchImages = function(callback){
        dispatch.articleAttachments(this.article, function(data){
            $.each(data.results, function(key, obj){
                self.images[obj.id] = obj;
            });
            callback();
        });
    }

    this.processShortcodes = function(input) {
        var matches = [];
        var pattern = /\[[^\[\]]*\]/g;
        while (matches = pattern.exec(input)) {
            var shortcode = matches[0];
            input = input.replace(shortcode, this.processShortcode(shortcode));
        }
        return input;
    }

    this.processShortcode = function(shortcode) {
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

        return this.processImage(id);
    }

    this.generateShortcodes = function(input) {
        var temp = $("<div>");
        var attachments = [];
        temp.html(input);
        temp.find('.dis-image').each(function(){
            var id = $(this).data('id');
            attachments.push(id);
            $(this).replaceWith("[image " + id + "]");
        });
        return {
            'html': temp.html(),
            'attachments': attachments,
        }
    }

    this.processImage = function(id) {

        var image = this.images[id].image;
        return '<img class="dis-image" data-id="' + id + '" src="http://dispatch.dev:8888/media/' + image.url + '" />';
    }

}

var Shortcodes = function(quill, options) {

    var CODES = {
        'image': processImage,
    }

    var IMAGES = {
        15: {
            'url': 'http://dispatch.dev:8888/media/images/miGnO.jpeg',
            'caption': 'This is a test caption',
        },
        22: {
            'url': 'http://dispatch.dev:8888/media/images/Dive_20150118_Cherihan-Hassun.jpg',
            'caption': 'This is a test caption',
        }
    }

    var quill = new Quill('#editor');
    var processed = processShortcodes($('.source-content').text());
    quill.setHTML(processed);



}

//var quill = new Quill('#editor');

var startImageDrop = function(){
    $('#editor .ql-line').each(function(){
        $(this).after('<div class="drop-area"></div>');
    })
    $( ".drop-area" ).droppable({
        hoverClass: 'hover',
        drop: function( event, ui ) {
            $( this ).before('<img src="http://dispatch.dev:8888/media/images/IMG_4369_9VKSVRm.jpg"/>');
        }
    });
    $('#editor .ql-line').addClass('no-bottom-margin');
}

var editorImageDrop = function(){
}

var stopImageDrop = function(){
    $('#editor .drop-area').remove();
    $('#editor .ql-line').removeClass('no-bottom-margin');
}
