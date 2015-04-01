var CSRF_TOKEN = $(".article-form").data('csrf');

var ImageStore = {
    images: [],
    dump: function(images){
        this.images = images;
    },
    append: function(images){
        this.images = this.images.concat(images);
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
    updateImage: function(id, callback){
        dispatch.find('image', id, function(data){
            var i = _.findIndex(this.images, {id: id});
            this.images[i] = data;
            callback();
        }.bind(this))
    },
    updateImageWithData: function(data){
        var i = _.findIndex(this.images, {id: data.id});
        this.images[i] = data;
    },
    replaceTemp: function(name, image){
        var i = _.findIndex(this.images, {tempName: name});
        this.images[i] = image;
    },
    getImage: function(id){
        var i = _.findIndex(this.images, {id: id});
        return this.images[i];
    },
    removeImage: function(id){
        _.remove(this.images, function(n) {
            return n.id == id;
        });
    },
    all: function(){
        return this.images;
    }
}

var ImageManager = React.createClass({displayName: "ImageManager",
    getInitialState: function(){
        return {
            visible: false,
            activeImage: false,
            selected: [],
            initialized: false,
            currentTrigger: false,
            nextImages: false,
            loadingMore: false,
            images: ImageStore,
            query: "",
        }
    },
    componentDidMount: function() {

        var func = this.selectImage;

        // Clicking outside container
        $(this.getDOMNode()).mouseup(function (e)
        {
            var container = $(this.getDOMNode()).find(".content");
            if (!container.is(e.target) && container.has(e.target).length === 0)
            {
                this.close();
                $('body').removeClass('no-scroll');
            }
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
                    nextImages: data.next,
                });
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
    deleteImage: function(id){
        dispatch.remove('image', id, function(){
            ImageStore.removeImage(id);
            this.setState({
                activeImage: false,
                images: ImageStore,
            });
        }.bind(this));
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
    updateImage: function(data){
        ImageStore.updateImageWithData(data);
        this.reloadStore();
    },
    onScroll: function(scroll){
        var scrollable = $(this.refs.scrollable.getDOMNode());
        var end = scrollable.children().first().innerHeight();
        var pos = scrollable.scrollTop() + scrollable.height();
        if(pos > end - 100 && !this.state.loadingMore){
            this.loadMore();
        }
    },
    loadMore: function(){
        if(this.state.nextImages){
            this.setState({ loadingMore: true });
            dispatch.getNext(this.state.nextImages, function(data){
                ImageStore.append(data.results);
                this.setState({
                    images: ImageStore,
                    loadingMore: false,
                    nextImages: data.next,
                });
            }.bind(this));
        }
    },
    searchImages: function(event){
        this.setState({
            activeImage: false,
            query: event.target.value,
        });
        dispatch.search("image", {'q': event.target.value, 'ordering': '-created_at'}, function(data){
            ImageStore.dump(data.results);
            this.setState({
                images: ImageStore,
            });
        }.bind(this));
    },
    renderImageMeta: function(){
        if ( this.state.activeImage ){
            var image = ImageStore.getImage(this.state.activeImage);
            return ( React.createElement(ImageMeta, {id: image.id, url: image.url, authors: image.authors, filename: image.filename, title: image.title, onDelete: this.deleteImage, onUpdate: this.updateImage}) );
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
            React.createElement("div", {className: 'modal image-manager ' + visible}, 
                React.createElement("div", {className: "body"}, 
                    React.createElement("div", {id: "image-manager", className: "content"}, 
                        React.createElement("div", {className: "header"}, 
                            React.createElement("nav", null, 
                                React.createElement("button", {className: "sq-button upload-images"}, "Upload  ", React.createElement("i", {className: "fa fa-upload"})), 
                                React.createElement("input", {type: "text", className: "dis-input image-search", placeholder: "Search", onChange: this.searchImages, value: this.state.query})
                            )
                        ), 
                        React.createElement("div", {id: "image-catalog", className: "content-area"}, 
                            React.createElement("div", {className: "image-catalog-container", ref: "scrollable", onScroll: this.onScroll}, 
                                React.createElement(ImageDropzone, {url: dispatch.getModelURL('image'), paramName: 'img', params: params, loadMode: this.loadMore, addFile: this.addFile, onClickHandler: this.selectImage, onUpload: this.onUpload, updateProgress: this.updateProgress, clickable: '.upload-images', images: this.state.images.all()})
                            ), 
                            this.renderImageMeta()
                        ), 
                        React.createElement("div", {className: "footer"}, 
                            React.createElement("nav", null, 
                                React.createElement("div", {className: "pull-right"}, 
                                    React.createElement("button", {className: "sq-button insert-image", onClick: this.insertImage}, "Insert")
                                )
                            )
                        )
                    )
                )
            )
        );
    }
});

var ImageMeta = React.createClass({displayName: "ImageMeta",
    getInitialState: function(){
        return this.getState();
    },
    getState: function(){
        return {
            authorName: this.props.authors[0] ? this.props.authors[0].full_name : "",
            author: this.props.authors[0] ? this.props.authors[0] : false,
            title: this.props.title,
            edited: false,
            saving: false,
            saved: false,
        }
    },
    componentDidMount: function(){
        $( ".image-meta input.add-author" ).autocomplete({
            minLength: 3,
            appendTo: '.image-meta .author-dropdown',
            focus: function (event, ui) {
                event.preventDefault();
                this.changeAuthor({id: ui.item.id, full_name: ui.item.full_name});
                $(event.target).val(ui.item.full_name);
            }.bind(this),
            source: function( request, response ) {
                var term = request.term;
                if ( term in authorCache ) {
                    response( authorCache[ term ] );
                    return;
                }
                // TODO: make use of the Dispatch API library
                $.getJSON( "http://localhost:8000/api/person/", {q: request.term}, function( data, status, xhr ) {
                    authorCache[ term ] = data.results;
                    response( data.results );
                });
            }
        }).autocomplete( "instance" )._renderItem = function( ul, item ) {
            return $( "<li>" )
            .append( "<a>" + item.id + "<br>" + item.full_name + "</a>" )
            .appendTo( ul );
        };
    },
    componentWillReceiveProps: function(nextProps){
        this.props = nextProps;
        this.setState(this.getState());
    },
    changeAuthor: function(author){
        this.setState({
            authorName: author.full_name,
            author: author,
        });
    },
    handleChangeAuthor: function(event){
        this.setState({
            authorName: event.target.value,
            author: false,
            edited: true,
        });
    },
    handleChangeTitle: function(event){
        this.setState({
            title: event.target.value,
            edited: true,
        });
    },
    handleUpdate: function(event){
        if(this.state.author){
            this.updateAuthor(this.state.author.id);
        } else {
            dispatch.add("person", {
                'full_name': this.state.authorName,
            }, function(data){
                this.updateAuthor(data.id);
            }.bind(this));
        }
    },
    handleDelete: function(){
        this.props.onDelete(this.props.id);
    },
    updateAuthor: function(authorId){
        this.setState({
            saving: true,
        });
        dispatch.update('image', this.props.id, {authors: authorId, title: this.state.title}, function(data){
            this.props.onUpdate(data);
            this.setState({
                saving: false,
                saved: true,
            });
            $('.image-meta .fa-check').fadeIn(500, function(){
                setTimeout(function(){
                    $('.image-meta .fa-check').fadeOut(500, function(){
                        this.setState({
                            saved: false,
                        });
                    }.bind(this));
                }.bind(this), 1000);
            }.bind(this));
        }.bind(this));
    },
    renderLoader: function(){
        if(this.state.saving){
            return (
                React.createElement("div", {className: "loader"})
            )
        } else if (this.state.saved){
            return (
                React.createElement("i", {className: "fa fa-check"})
            );
        }
    },
    render: function(){
        return (
            React.createElement("div", {className: "image-meta"}, 
                React.createElement("img", {className: "image-meta-preview", src:  this.props.url}), 
                React.createElement("h3", null, this.props.filename), 
                React.createElement("div", {className: "field"}, 
                    React.createElement("label", null, "Title:"), 
                    React.createElement("input", {type: "text", className: "full", onChange:  this.handleChangeTitle, value:  this.state.title})
                ), 
                React.createElement("div", {className: "field"}, 
                    React.createElement("label", null, "Photographer:"), 
                    React.createElement("input", {type: "text", className: "dis-input add-author", onChange:  this.handleChangeAuthor, value:  this.state.authorName}), 
                    React.createElement("div", {className: "author-dropdown"})
                ), 
                React.createElement("div", {className: "field"}, 
                    React.createElement("div", {className: "pull-left"}, 
                        React.createElement("button", {onClick: this.handleUpdate, className: "sq-button green update-image", disabled: !this.state.edited}, "Update"), 
                        this.renderLoader()
                    ), 
                    React.createElement("div", {className: "pull-right"}, 
                        React.createElement("button", {onClick: this.handleDelete, className: "sq-button red"}, "Delete")
                    )
                )
            )
        );
    }
})

var ImageDropzone = React.createClass({displayName: "ImageDropzone",
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
        $(file.previewElement).data("url", image.url);
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
        React.createElement(Image, {id: image.id, thumb: image.thumb, url: image.url, progress: image.progress, onClickHandler: this.props.onClickHandler})
      );
    }.bind(this));
    return (
        React.createElement("ul", {id: "image-dropzone", ref: "imageContents", className: "image-results"}, 
        imageNodes
        )
    );
  }
});

var Image = React.createClass({displayName: "Image",
    onClick: function(){
        this.props.onClickHandler(this.props.id);
    },
    render: function(){
        var styles = {backgroundImage: "url('" + this.props.thumb + "')"};
        if(this.props.progress){
        //    styles.opacity = 100 / this.props.progress;
        }
        return (
            React.createElement("li", {className: 'catalog-image', onClick: this.onClick, style: styles, "data-id": this.props.id, "data-url": this.props.url})
        );
    }
})

var imageManager = React.render(
    React.createElement(ImageManager, null),
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

function cloneAttachmentForm(image){
    var form_idx = $('#id_imageattachment_set-TOTAL_FORMS').val();
    $('#attachments-form').append($('#attachment-template').html().replace(/__prefix__/g, form_idx));
    $('#id_imageattachment_set-'+form_idx+'-image').val(image.id);
    $('#attachment-thumb-'+form_idx).css('background-image', "url('"+image.thumb+"')");
    $('#id_imageattachment_set-TOTAL_FORMS').val(parseInt(form_idx) + 1);
}

var DispatchTextEditor = function(quill, options) {

    var self = this;
    this.quill = quill;
    this.options = options;
    this.button = $(options.button);
    this.article = options.article;
    this.inlineEditorOpen = false;
    this.lastIndex;

    var inlineToolbar = this.quill.addContainer('inline-toolbar');
    var imageTools = this.quill.addContainer('image-tools');

    $(imageTools).html($('#image-tools').html());
    $(inlineToolbar).html($('#inline-toolbar').html());
    this.quill.addFormat('cssClass', {
        class: 'format-',
    });

    this.attachmentCount = 0;

    $('.tb-image').imageModal(function(items){

        var id = items[0];
        var image = ImageStore.getImage(id);

        cloneAttachmentForm(image);

        self.addImage(image.url, this.attachmentCount);

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
    var options = {
        'src': src,
        'data-temp-id': id,
        'class': 'dis-image',
    }
    this.quill.insertEmbed(this.lastIndex, 'image', options);

    $("#editor").find()
    this.closeInlineToolbar();
    if(lastLine)
        this.quill.editor.doc.appendLine(document.createElement('P'));
}

Quill.registerModule('shortcode', DispatchTextEditor);


function Editor() {

    this.CODES = {
        'image': this.processImage,
    }

    this.images = {};
    this.quill;
    this.article;
    this.source;
    this.attachment_field = ".attachment-field";
    this.saved;
    this.saveid;

    var self = this;

    var selected_image;

    $(document).on("mouseleave", ".image-tools", function(){
        $(this).hide();
    });

    $(document).on('click', '.attachment-delete', function(e){
        e.preventDefault();
        var index = $(this).data('index');
        $('#attachment-form-'+index).hide();
        $('#id_imageattachment_set-'+index+'-DELETE').val(1);
    });

    this.init = function(article, source, saveAttempt, saved, saveid) {
        this.article = article;
        this.source = source;
        this.saved = saved;
        this.saveid = saveid;
        this.saveAttempt = saveAttempt;

        if(article){
            this.fetchImages(function(){
                self.setupEditor();
                self.loadAttachmentThumbs();
            });
        } else {
            self.setupEditor();
        }
    }

    this.loadAttachmentThumbs = function(){
        $('.attachment-thumb').each(function(){
            var id = $(this).data('id');
            var a = self.images[id];
            $(this).css('background-image', "url('"+a.image.thumb+"')");
        });
    }

    this.setupEditor = function(){
        self.quill = new Quill('#editor');

        self.quill.addModule('shortcode', { button: '#add_shortcode', article: self.article });
        self.quill.addModule('toolbar', { container: '#full-toolbar' });
        self.quill.addModule('link-tooltip', true);

        if(self.saveAttempt && !self.saved){
            self.quill.setHTML(sessionStorage['articleContent_'+self.saveid]);
        } else {
            self.quill.setHTML(self.processShortcodes($(self.source).text()));
        }
    }

    this.validCode = function(func){
        return this.CODES.hasOwnProperty(func);
    }

    this.prepareSave = function(){
        var html = self.quill.getHTML();

        // Store old HTML in browser cache
        sessionStorage['articleContent_'+self.saveid] = html;

        // Store attachments list in browser cache
        // sessionStorage['articleAttachemnts_'+self.saveid] = attachm

        var output = self.generateShortcodes(html);

        $(self.source).text(output);
    }

    this.fetchImages = function(callback){
        dispatch.articleAttachments(this.article, function(data){
            console.log(data);
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

        var replacement = this.processImage(id);
        if(replacement){
            return replacement;
        } else {
            return shortcode;
        }
    }

    this.generateShortcodes = function(input) {
        var temp = $("<div>");
        temp.html(input);
        temp.find('.dis-image').each(function(){
            if(typeof $(this).data('id') !== 'undefined'){
                $(this).replaceWith("[image " + $(this).data('id') + "]");
            } else if (typeof $(this).data('temp-id') !== 'undefined') {
                $(this).replaceWith("[temp_image " + $(this).data('temp-id') + "]");
            }
        });

        return temp.html();
    }

    this.processImage = function(id) {
        var attachment = this.images[id];
        if(typeof attachment !== 'undefined'){
            return '<img class="dis-image" data-id="' + id + '" src="' + attachment.image.url + '" />';
        } else {
            return false;
        }
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
