var articleHeader = false;

$(function(){
    if($(document).scrollTop() > 50){
        articleHeader = true;
        $('.header-site').hide();
        $('.header-article').show();
    }
});

$(document).scroll(function() {
    var top = $(document).scrollTop();
    if (top > 50 && !articleHeader){
        articleHeader = true;
        $('.header-site').hide();
        $('.header-article').fadeIn();
    } else if (top < 50 && articleHeader){
        articleHeader = false;
        $('.header-article').hide();
        $('.header-site').show();
    }
});


var Gallery = React.createClass({displayName: "Gallery",
    getInitialState: function(){
        return {
            images: {},
            images_list: [],
            currentIndex: false,
            currentImage: false,
            image: false,
            image_height: false,
            initialized: false,
            visible: false,
        }
    },
    initializeImages: function(callback) {
        dispatch.articleAttachments(this.props.article, function(data){
            var images = {};

            $.each(data.results, function(key, image){
                images[image.attachment_id] = key;
            });

            this.setState({
                images: images,
                images_list: data.results,
                image_height: $(window).height() - 200,
                initialized: true,
            });

            this.setupEventListeners();

            callback();

        }.bind(this));
    },
    setupEventListeners: function(){

        // Keyboard controls
        key('left', this.previous);
        key('right', this.next);
        key('esc', this.close);

        // Arrow buttons
        $(document).on('click', '.prev-slide', function(e){
            e.preventDefault();
            this.previous();
        }.bind(this));
        $(document).on('click', '.next-slide', function(e){
            e.preventDefault();
            this.next();
        }.bind(this));

        // Clicking outside container
        $(this.getDOMNode()).mouseup(function (e)
        {
            var container = $(this.getDOMNode()).find(".slide");
            if (!container.is(e.target) && container.has(e.target).length === 0)
            {
                this.close();
                $('body').removeClass('no-scroll');
            }
        }.bind(this));

    },
    addSlideTrigger: function(target, action, id_key){
        $(target).on(action, function(e){
            e.preventDefault();
            var image_id = $(e.target).data("id");

            if(gallery.state.visible){
                this.close();
            } else {
                if(!this.state.initialized){
                    this.initializeImages(function(){
                        this.open(image_id);
                    }.bind(this));
                } else {
                    this.open(image_id);
                }
            }

        }.bind(this));
    },
    setCurrentImage: function(image_id){
        this.setState({
            currentImage: image_id,
        });
    },
    setCurrentIndex: function(currentIndex){
        this.setState({
            currentIndex: currentIndex,
        });
    },
    displayCurrentImage: function(){
        var currentIndex = this.state.images[this.state.currentImage];
        var attachment = this.state.images_list[currentIndex];
        this.setState({
            currentIndex: currentIndex,
            image: attachment.url,
            caption: attachment.caption,
        });
    },
    open: function(image_id){
        this.setCurrentImage(image_id);
        this.displayCurrentImage();
        this.setState({
            visible: true,
        });
        $('body').addClass('no-scroll');
    },
    close: function(){
        this.setState({
            visible: false,
        });
        $('body').removeClass('no-scroll');
    },
    previous: function(){
        if(this.state.currentIndex == 0) return;
        this.setCurrentIndex(this.state.currentIndex - 1);
        this.setCurrentImage(this.state.images_list[this.state.currentIndex].attachment_id);
        this.displayCurrentImage();
    },
    next: function(){
        if(this.state.currentIndex + 1 >= this.state.images_list.length) return;
        this.setCurrentIndex(this.state.currentIndex + 1);
        this.setCurrentImage(this.state.images_list[this.state.currentIndex].attachment_id);
        this.displayCurrentImage();
    },
    renderImage: function(){
        if(this.state.image){
            var imageStyle = {
                maxHeight: this.state.image_height,
            };
            return (
                React.createElement("div", {className: "slide"}, 
                    React.createElement("img", {className: "slide-image", style: imageStyle, src:  this.state.image}), 
                    React.createElement("p", {className: "slide-caption"}, this.state.caption), 
                    this.renderControls()
                )
            );
        }
    },
    renderControls: function(){
        if(this.state.images_list.length > 1){
            return (
                React.createElement("div", {className: "navigation"}, 
                    React.createElement("a", {className: "prev-slide", href: "#"}, React.createElement("i", {className: "fa fa-chevron-left"})), 
                    React.createElement("span", {className: "curr-slide"}, this.state.currentIndex + 1), "   of   ", React.createElement("span", {className: "total-slide"}, this.state.images_list.length), 
                    React.createElement("a", {className: "next-slide", href: "#"}, React.createElement("i", {className: "fa fa-chevron-right"}))
                )
            );
        }
    },
    render: function() {
        if(this.state.visible){
            var visible = "visible";
        } else {
            var visible = "";
        }
        return (
            React.createElement("div", {className: 'slideshow ' + visible}, 
                React.createElement("div", {className: "image-container"}, 
                    React.createElement("div", {className: "image-inner"}, 
                    this.renderImage()
                    )
                )
            )
        );
    }
});

var article = $('article').data("id");
var gallery = React.render(
    React.createElement(Gallery, {article: article}),
    document.getElementById('gallery')
);

gallery.addSlideTrigger('.article-attachment', 'click', 'id');