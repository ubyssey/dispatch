(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Editor = require('./editor.js');
var ImageManager = require('./components/ImageManager.jsx');

var imageManager = React.render(
    React.createElement(ImageManager, null),
    document.getElementById('modals')
);

$.fn.imageModal = function(callback){
   imageManager.addTrigger(this, callback);
}

var ARTICLE_ID = $(".article-form").data("id");
var ARTICLE_SAVEATTEMPT = $(".article-form").data("saveattempt");
var ARTICLE_SAVED = $(".article-form").data("saved");
var ARTICLE_SAVEID = $(".article-form").data("saveid");

$('.input-tags').tagList("tag");
$('.input-topics').tagList("topics");

var confirmOnPageExit = function (e)
{
    // If we haven't been passed the event get the window.event
    e = e || window.event;

    var message = 'You have made changes to the article.';

    // For IE6-8 and Firefox prior to version 4
    if (e)
    {
        e.returnValue = message;
    }

    // For Chrome, Safari, IE8+ and Opera 12+
    return message;
};

function setChanged(){
    window.onbeforeunload = confirmOnPageExit;
};

$(".article-form").change(function(){
    setChanged();
});

function addAuthor(author){
    if (typeof author === 'object'){
        appendAuthor(author);
    } else {
        dispatch.add("person", {
            'full_name': author,
        }, function(data){
            appendAuthor(data);
        });
    }
}

function appendAuthor(author){
    if(!authorList.hasOwnProperty(author.id)) {
        authorList[author.id] = author.full_name;
        $('ul.author-list').append(
            $('<li>')
                .attr("data-id", author.id)
                .append(
                    $('<span>').text(author.full_name)
                        .append(
                             $('<a href="#" class="delete-author"><i class="fa fa-close"></i></a>')
                        )
                )
        );
        updateAuthorField();
    }
}

$('input.add-author').keydown(function(e){
    if(e.keyCode == 13 && !authorSelected)
    {
        e.preventDefault();
        addAuthor($(this).val());
        $(this).val("");
    }
});

function updateAuthorField(){
    var authors = $('ul.author-list').sortable( "toArray", { "attribute": "data-id"});
    $('.input-authors').val(authors.join(","));
}

function updateDate(date, time){
    published_at = moment(date.get() + " " + time.get('view', 'HH:i'), 'DD MMMM, YYYY HH:mm');
    $('#id_published_at').val(published_at.format('YYYY-MM-DD HH:mm:ss'));
}

var tabs;
var authorList = {};
var authorCache = {};
var authorSelected = false;

$(function(){

    $('.options.panel').tabs();

    var published_at = moment($('#id_published_at').val(), 'YYYY-MM-DD HH:mm:ss');

    var pickdate = $('*[name=published_at_date]').data("value", published_at.format('YYYY-MM-DD')).pickadate({
        formatSubmit: 'yyyy-mm-dd',
    }).pickadate('picker');

    var picktime = $('*[name=published_at_time]').data("value", published_at.format('HH:mm')).pickatime().pickatime('picker');

    updateDate(pickdate, picktime);
    pickdate.on('set', function(){ updateDate(pickdate, picktime);});
    picktime.on('set', function(){ updateDate(pickdate, picktime);});

    $('.edit-authors').click(function(e){
        e.preventDefault();
        if($('.manage-authors').is(':visible')){
            $('.manage-authors').slideUp();
        } else {
            $('.manage-authors').slideDown();
        }
    });

    $(document).on("click", '.delete-author', function(e){
        e.preventDefault();
        var id = $(this).parent().parent().data("id");
        $(this).parent().parent().remove();
        updateAuthorField();
        delete authorList[id];
    });

    $('ul.author-list li').each(function(key, item){
        var id = $(item).data("id");
        var name = $(item).text();
        authorList[id] = name;
    });

    $( "ul.author-list" ).sortable({
      placeholder: "ui-state-highlight",
      update: function(event, ui){
          updateAuthorField();
      }
    });

    $( ".manage-authors input.add-author" ).autocomplete({
      minLength: 3,
      appendTo: '.manage-authors .author-dropdown',
      focus: function (event, ui) {
        event.preventDefault();
        authorSelected = true;
        $(this).val(ui.item.full_name);
      },
      select: function( event, ui ) {
        addAuthor({id: ui.item.id, full_name: ui.item.full_name});
      },
      source: function( request, response ) {
        var term = request.term;
        if ( term in authorCache ) {
          response( authorCache[ term ] );
          return;
        }

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

    tabs = $('#image-manager').tabs();
    $(window).keydown(function(e){
        if(e.keyCode == 13) {
        }
    });
    $('textarea.headline').autosize();
    $('textarea.headline').keydown(function(e){
        if(e.keyCode == 13) {
            e.preventDefault();
        }
    });
});


var images = [];

//$('.modal-trigger').imageModal(function(items){
//    $.each(items, function(key, image){
//        if(images.indexOf(image) == -1){
//            var attachment = new Attachment(ARTICLE_ID, image);
//            attachment.save(function(){
//                var img = $("<li>")
//                    .css("background-image", "url('http://dispatch.dev:8888/media/"+image.thumb+"')");
//                img.data("id", attachment.id);
//                $(".images-list").append(img);
//            });
//        }
//    });
//});

$(document).on("click", "ul.images-list li", function(){
    var id = $(this).data("id");
    var element = this;
    dispatch.remove("attachment", id, function(){
        $(element).remove();
    });
});

$(document).on("click", "ul.tags li", function(){
    var tag_name = $(this).text();
    var index = tags.indexOf(tag_name);
    if(index != -1){
        tags.splice(index, 1);
    }
    $(this).remove();
});

var editor = Editor(ARTICLE_ID, "textarea.content", ARTICLE_SAVEATTEMPT, ARTICLE_SAVED, ARTICLE_SAVEID);
editor.setImageManager(imageManager);
editor.setupEmbeds();
editor.init();

$(".submit-article").click(function(e){
    e.preventDefault();
    editor.prepareSave();
    window.onbeforeunload = null;
    $('.article-form').submit();
});

$(".publish-article").click(function(e){
    e.preventDefault();
    editor.prepareSave();
    window.onbeforeunload = null;
    $('#id_is_published').val('True');
    $('.article-form').submit();
});

$(".unpublish-article").click(function(e){
    e.preventDefault();
    editor.prepareSave();
    window.onbeforeunload = null;
    $('#id_is_published').val('False');
    $('.article-form').submit();
});

$('.set-featured-image').imageModal(function(items){
    var image = items[0];
    $('#id_image').val(image.id);
    $('img.featured-image').attr("src", image.url);
});

window.editor = editor;

},{"./components/ImageManager.jsx":5,"./editor.js":10}],2:[function(require,module,exports){
var EditorImage = require('./embeds/EditorImage.jsx');

var DispatchTextEditor = function(quill, options) {

    var self = this;
    this.quill = quill;
    this.options = options;
    this.article = options.article;
    this.inlineEditorOpen = false;
    this.lastIndex;

    this.embeds = options.embeds;

    var inlineToolbar = this.quill.addContainer('inline-toolbar');
    var imageTools = this.quill.addContainer('image-tools');

    $(imageTools).html($('#image-tools').html());
    $(inlineToolbar).html($('#inline-toolbar').html());

    $.each(this.quill.getEmbeds(), function(key, item){
        $('.inline-toolbar .toolbar').append(
            $('<button class="tb-'+key+' dis-button">').text(key)
        );
        $('.tb-'+key).click(function(e){
            e.preventDefault();
            if (typeof item.trigger !== 'undefined'){
                item.trigger(function(data){
                    if (typeof data === 'undefined')
                        data = {}
                    this.addEmbed(key, data);
                }.bind(this));
            } else {
                this.addEmbed(key, {});
            }
        }.bind(this));
    }.bind(this));

    $('.inline-toolbar .tb-toolbar').click(function(e){
        e.preventDefault();
        this.inlineEditorOpen = true;
        $('.inline-toolbar .toolbar').show();
        self.quill.setSelection();
    });

    quill.on('text-change', function (delta, source) {
        self.inlineToolbar();
    });

    quill.on('selection-change', function(range) {
        self.inlineToolbar();
    });

}

DispatchTextEditor.prototype.addEmbed = function(type, data) {
    var lastLine = this.quill.getLength() - 1 == this.lastIndex;

    this.quill.insertEmbed(type, data, this.lastIndex);

    $("#editor").find()
    this.closeInlineToolbar();
    if(lastLine)
        this.quill.editor.doc.appendLine(document.createElement('P'));
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

// Register DispatchTextEditor with Quill
Quill.registerModule('dispatch', DispatchTextEditor);

module.exports = DispatchTextEditor;

},{"./embeds/EditorImage.jsx":9}],3:[function(require,module,exports){
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
});

module.exports = Image;


},{}],4:[function(require,module,exports){
var Image = require('./Image.jsx');

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

    options.params = {
        'csrfmiddlewaretoken': dispatch.getCSRFToken(),
    }

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

module.exports = ImageDropzone;

},{"./Image.jsx":3}],5:[function(require,module,exports){
var ImageStore = require('./ImageStore.js');
var ImageMeta = require('./ImageMeta.jsx');
var ImageDropzone = require('./ImageDropzone.jsx');

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
        this.callback = false;
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
    openWithCallback: function(callback){
        this.callback = callback;
        this.open();
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
        if(this.callback) {
            this.callback(ImageStore.getImages(this.state.selected));
            this.callback = false;
        } else {
            this.callbacks[this.state.currentTrigger.selector](ImageStore.getImages(this.state.selected));
        }
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
                                React.createElement(ImageDropzone, {url: dispatch.getModelURL('image'), paramName: 'img', loadMode: this.loadMore, addFile: this.addFile, onClickHandler: this.selectImage, onUpload: this.onUpload, updateProgress: this.updateProgress, clickable: '.upload-images', images: this.state.images.all()})
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

module.exports = ImageManager;

},{"./ImageDropzone.jsx":4,"./ImageMeta.jsx":6,"./ImageStore.js":7}],6:[function(require,module,exports){
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
});

module.exports = ImageMeta;

},{}],7:[function(require,module,exports){
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
    getImages: function(ids){
        var images = [];
        _.forEach(ids, function(id, index){
            images.push(this.getImage(id));
        }.bind(this));
        return images;
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

module.exports = ImageStore;

},{}],8:[function(require,module,exports){
var EditorCode = React.createClass({displayName: "EditorCode",
    getInitialState: function(){
        return {
            content: this.props.data.content ? this.props.data.content : '',
        };
    },
    handleContentChange: function(event){
        this.setState({
            content: event.target.value,
        });
    },
    getJSON: function(){
        return {
            type: 'code',
            data: {
                content: this.state.content,
            }
        }
    },
    render: function(){
        return (
            React.createElement("div", {className: "embed-code"}, 
                React.createElement("textarea", {placeholder: "Write some code", onChange: this.handleContentChange}, this.state.content)
            )
            );
    }
});


var factory = {
    controller: function(node, embed){
        return React.render(
            React.createElement(EditorCode, {data: embed.data}),
            node
        );
    },
}

module.exports = factory;

},{}],9:[function(require,module,exports){
var EditorImage = React.createClass({displayName: "EditorImage",
    getInitialState: function(){
        return {
            type: 'single',
            images: this.props.data.images,
            caption: this.props.data.caption ? this.props.data.caption : '',
        };
    },
    componentDidMount: function(){
        $(React.findDOMNode(this.refs.captionTextarea)).autosize();
    },
    addImage: function(image){
        if (this.state.images.length > 1)
            return
        var image = {
            id: image.id,
            src: image.url,
        }
        var images = this.state.images;
        images.push(image);
        this.setState({
            images: images,
        });
    },
    openImageManager: function(){
        this.props.manager.openWithCallback(function(items){
            this.addImage(items[0]);
        }.bind(this));
    },
    toggleType: function(e){
        e.preventDefault();
        var newType;
        if (this.state.type == 'single')
            newType = 'double';
        else
            newType = 'single';
        this.setState({
            type: newType,
        });
    },
    handleCaptionChange: function(event){
        this.setState({
            caption: event.target.value,
        });
    },
    getJSON: function(){
        return {
            type: 'image',
            data: {
                attachment_id: this.props.data.attachment_id ? this.props.data.attachment_id : false,
                subtype: this.state.type,
                images: this.state.images,
                caption: this.state.caption,
            }
        }
    },
    render: function(){
        var imageNodes = this.state.images.map(function (image) {
            return (
                React.createElement("img", {className: "item", key: image.id, src: image.src})
                );
        });
        var showAddButton = this.state.images.length == 1 && this.state.type == 'double' ? 'show-add-button' : '';
        return (
            React.createElement("div", {className: "image"}, 
                React.createElement("div", {className: "image-toolbar-container"}, 
                    React.createElement("div", {className: "image-toolbar"}, 
                        React.createElement("a", {href: "#", onClick: this.toggleType}, "Type")
                    )
                ), 
                React.createElement("div", {className: 'images ' + this.state.type + ' ' + showAddButton}, 
                    imageNodes, 
                    React.createElement("div", {className: "add-image", ref: "addImage"}, 
                        React.createElement("a", {href: "#", onClick: this.openImageManager}, "Add Image")
                    )
                ), 
                React.createElement("div", {className: "image-caption"}, 
                    React.createElement("textarea", {placeholder: "Write a caption", ref: "captionTextarea", onChange: this.handleCaptionChange}, this.state.caption)
                )
            )
            );
    }
});


var factory = function(manager, images){
    var controller = function(node, embed){
        if(typeof embed.data.images === 'undefined'){
            var id = embed.data.attachment_id;
            var attachment = images[id];
            embed.data.images = [{
                id: attachment.image.id,
                src: attachment.image.url
            }];
            embed.data.caption = attachment.caption;
        }
        var component = React.render(
            React.createElement(EditorImage, {data: embed.data, manager: manager}),
            node
        );
        return component;
    }
    return {
        controller: controller,
        trigger: function(callback){
            manager.openWithCallback(function(items){
                var image = items[0];
                var data = {
                    'images': [{
                        id: image.id,
                        src: image.url,
                    }]
                }
                callback(data);
            });
        }
    };
}

module.exports = factory;

},{}],10:[function(require,module,exports){
var CSRF_TOKEN = $(".article-form").data('csrf');

var DispatchTextEditor = require('./components/DispatchTextEditor.js');
var EditorImage = require('./components/embeds/EditorImage.jsx');
var EditorCode = require('./components/embeds/EditorCode.jsx');

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
                        React.createElement(embed.controller, React.__spread({},  embed.props)),
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


},{"./components/DispatchTextEditor.js":2,"./components/embeds/EditorCode.jsx":8,"./components/embeds/EditorImage.jsx":9}]},{},[1]);
