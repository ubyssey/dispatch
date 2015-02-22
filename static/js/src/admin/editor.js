var CSRF_TOKEN = $(".article-form").data('csrf');

var ImageStore = {
    images: [],
    dump: function(images){
        this.images = images;
    },
    addTemp: function(name, thumb){
        var tempImage = {
            tempName: name,
            thumb: thumb,
        }
        this.images.unshift(tempImage);
    },
    updateProgress: function(name, progress){
        var i = _.findIndex(this.images, {tempName: name})
        this.images[i].progress = progress;
    },
    replaceTemp: function(name, image){
        var i = _.findIndex(this.images, {tempName: name});
        this.images[i] = image;
    },
    getImage: function(id){
        var i = _.findIndex(this.images, {id: id});
        return this.images[i];
    },
    all: function(){
        return this.images;
    }
}

var ImageManager = React.createClass({
    getInitialState: function(){
        return {
            visible: false,
            activeImage: false,
            selected: [],
            initialized: false,
            currentTrigger: false,
            images: ImageStore,
        }
    },
    componentDidMount: function() {
        $('#image-catalog').on('click', 'li.catalog-image', function(e){
           this.selectImage($(e.target).data('id'));
        }.bind(this));
        $('#image-manager').on('click', 'button.insert-image', function(e){
           e.preventDefault();
           this.insertImage();
        }.bind(this));

        // Initalize callbacks object
        this.callbacks = {};
    },
    addTrigger: function(trigger, callback){
        this.callbacks[trigger.selector] = callback;
        this.addTriggerEvent(trigger);
    },
    addTriggerEvent: function(trigger){
        $(trigger).click(function(e){
            e.preventDefault();
            this.setState({ currentTrigger: trigger });
            this.open();
        }.bind(this));
    },
    open: function(){
        if(!this.state.initialized){
            dispatch.search("image", {'ordering': '-created_at'}, function(data){
                ImageStore.dump(data.results);
                this.setState({
                    images: ImageStore,
                    initialized: true,
                    visible: true,
                })
            }.bind(this));
        } else {
            this.setState({
                visible: true,
                selected: [],
            })
        }
    },
    close: function(){
        this.setState({ visible: false });
    },
    insertImage: function(){
        this.callbacks[this.state.currentTrigger.selector](this.state.selected);
        this.close();
    },
    selectImage: function(id){
        if(this.props.multiple){
            var selected = this.state.selected;
            selected.push(id);
        } else {
            var selected = [id];
        }
        this.setState({
            activeImage: id,
            selected: selected,
        });
    },
    addFile: function(file, dataUrl){
        ImageStore.addTemp(file.name, dataUrl);
        this.reloadStore();
    },
    onUpload: function(file, image){
        ImageStore.replaceTemp(file.name, image);
        this.reloadStore();
    },
    updateProgress: function(file, progress, bytesSent){
        ImageStore.updateProgress(file.name, progress);
        this.reloadStore();
    },
    reloadStore: function(){
        this.setState({
            images: ImageStore,
        });
    },
    renderImageMeta: function(){
        console.log(this.state.selected);
        if ( this.state.activeImage ){
            var image = ImageStore.getImage(this.state.activeImage);
            return ( <ImageMeta url={image.url} /> );
        }
    },
    render: function() {

        if( this.state.visible ){
            var visible = "visible";
        } else {
            var visible = "";
        }

        var params = {
            'csrfmiddlewaretoken': CSRF_TOKEN,
        }

        return (
            <div className={'modal image-manager ' + visible}>
                <div className="body">
                    <div id="image-manager" className="content">
                        <div className="header">
                            <nav>
                                <a className="upload-images">Upload</a>
                            </nav>
                        </div>
                        <div id="image-catalog" className="content-area">
                            <ImageDropzone url={'http://localhost:8000/api/image/'} paramName={'img'} params={params} addFile={this.addFile} onUpload={this.onUpload} updateProgress={this.updateProgress} clickable={'.upload-images'} images={this.state.images.all()}/>
                            {this.renderImageMeta()}
                        </div>
                        <div className="footer">
                            <button className="insert-image">Insert</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var ImageMeta = React.createClass({
    render: function(){
        return (
            <div className="image-meta">
                <img className="image-meta-preview" src={this.props.url} />
                <label>Photographer:</label>
                {this.props.author}
            </div>
        );
    }
})

var ImageDropzone = React.createClass({
  componentDidMount: function() {
    var options = {};
    for (var opt in Dropzone.prototype.defaultOptions) {
      var prop = this.props[opt];
      if (prop) {
        options[opt] = prop;
        continue;
      }
      options[opt] = Dropzone.prototype.defaultOptions[opt];
    }
    options.addedfile = function(file){};
    options.success = function(file, image){
        $(file.previewElement).addClass("catalog-image");
        $(file.previewElement).data("id", image.id);
        $(file.previewElement).data("url", "http://dispatch.dev:8888/media/" + image.url);
        this.props.onUpload(file, image);
    }.bind(this);

    this.dropzone = new Dropzone(this.getDOMNode(), options);
    this.dropzone.on("uploadprogress", this.props.updateProgress);
    this.dropzone.on("thumbnail", this.props.addFile)
  },
  componentWillUnmount: function() {
    this.dropzone.destroy();
    this.dropzone = null;
  },
  render: function() {
    var children = this.props.children;
    var imageNodes = this.props.images.map(function (image) {
      return (
        <Image id={image.id} thumb={image.thumb} url={image.url} progress={image.progress} />
      );
    });
    return (
        <ul id="image-dropzone" className="image-results">
        {imageNodes}
        </ul>
    );
  }
});

var Image = React.createClass({
    render: function(){
        var styles = {backgroundImage: "url('" + this.props.thumb + "')"};
        if(this.props.progress){
        //    styles.opacity = 100 / this.props.progress;
        }
        return (
            <li className={'catalog-image'} style={styles} data-id={this.props.id} data-url={this.props.url}></li>
        );
    }
})

var imageManager = React.render(
    <ImageManager />,
    document.getElementById('modals')
);

$.fn.imageModal = function(callback){
   imageManager.addTrigger(this, callback);
}

$('.set-featured-image').imageModal(function(items){
    var id = items[0];
    var image = ImageStore.getImage(id);
    $('#id_image').val(image.id);
    $('img.featured-image').attr("src", image.url);
});

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

    $('.tb-image').imageModal(function(items){
        var id = items[0];
        var image = ImageStore.getImage(id);
        if(images.indexOf(image) == -1){
            var attachment = new Attachment(self.article, image);
            attachment.save(function(data){
                self.addImage(image.url, data.id);
                self.updateSource();
                images.push(attachment);
            });
        }
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
        return '<img class="dis-image" data-id="' + id + '" src="' + image.url + '" />';
    }

}

var Shortcodes = function(quill, options) {

    var CODES = {
        'image': processImage,
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
