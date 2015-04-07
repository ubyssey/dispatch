var EditorImage = require('./embeds/EditorImage.jsx');

var DispatchTextEditor = function(quill, options) {

    var self = this;
    this.quill = quill;
    this.options = options;
    this.button = $(options.button);
    this.article = options.article;
    this.inlineEditorOpen = false;
    this.lastIndex;

    this.embeds = options.embeds;

    var inlineToolbar = this.quill.addContainer('inline-toolbar');
    var imageTools = this.quill.addContainer('image-tools');

    $(imageTools).html($('#image-tools').html());
    $(inlineToolbar).html($('#inline-toolbar').html());
    this.quill.addFormat('cssClass', {
        class: 'format-',
    });

    this.attachmentCount = 0;

    function cloneAttachmentForm(image){
        var form_idx = $('#id_imageattachment_set-TOTAL_FORMS').val();
        $('#attachments-form').append($('#attachment-template').html().replace(/__prefix__/g, form_idx));
        $('#id_imageattachment_set-'+form_idx+'-image').val(image.id);
        $('#attachment-thumb-'+form_idx).css('background-image', "url('"+image.thumb+"')");
        $('#id_imageattachment_set-TOTAL_FORMS').val(parseInt(form_idx) + 1);
    }

    $('.tb-image').imageModal(function(items){

        var image = items[0];

        cloneAttachmentForm(image);

        self.addImage(image.url, image.id);

        this.attachmentCount = this.attachmentCount + 1;

    }.bind(this));


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

DispatchTextEditor.prototype.update = function(){
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

DispatchTextEditor.prototype.highlightText = function () {

    $('textarea.content').html(this.quill.getHTML());

}

DispatchTextEditor.prototype.updateSource = function() {
    $('textarea.content').html(this.quill.getHTML());
}

DispatchTextEditor.prototype.inlineToolbar = function() {

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

DispatchTextEditor.prototype.closeInlineToolbar = function() {
    $('.inline-toolbar .toolbar').hide();
    $('.inline-toolbar').hide();
}

DispatchTextEditor.prototype.addImage = function(src, id) {

    var lastLine = this.quill.getLength() - 1 == this.lastIndex;

    var images = [
        {
            id: id,
            src: src,
        }
    ]

    var inserted = this.quill.insertEmbed('image', {images:images}, this.lastIndex);

    //var image = React.render(
    //    <EditorImage temp={true} images={images} manager={this.options.editor.manager} />,
    //    inserted
    //);

    //this.embeds[$(inserted).attr('id')] = image;

    $("#editor").find()
    this.closeInlineToolbar();
    if(lastLine)
        this.quill.editor.doc.appendLine(document.createElement('P'));
}

DispatchTextEditor.prototype.test_html = function(){
    $.each(this.embeds, function(key, embed){
        $(image.getDOMNode()).replaceWith(image.asShortcode());
    });
}


// Add DispatchTextEditor module to Quill
Quill.registerModule('dispatch', DispatchTextEditor);

module.exports = DispatchTextEditor;