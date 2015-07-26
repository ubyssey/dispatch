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


var Gallery = React.createClass({
    getInitialState: function(){
        return {
            index: false,
            image: false,
            visible: false,
        }
    },
    componentDidMount: function(){
        console.log(this.props.selector);
        this.addSlideTrigger(this.props.selector);
        this.setupEventListeners();
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
    addSlideTrigger: function(target){
        $(target).on('click', function(e){
            e.preventDefault();
            var image_id = $(e.target).data("id");

            if(this.state.visible){
                this.close();
            } else {
                this.open(image_id);
            }

        }.bind(this));
    },
    setIndex: function(index){
        var attachment = this.props.images[index];
        this.setState({
            index: index,
            image: attachment.url,
            caption: attachment.caption,
        });
    },
    setCurrentImage: function(imageId){
        var index = this.props.imagesTable[imageId];
        return this.setIndex(index);
    },
    open: function(imageId){
        this.setCurrentImage(imageId);
        this.setState({ visible: true });
        $('body').addClass('no-scroll');
    },
    close: function(){
        this.setState({
            visible: false,
        });
        $('body').removeClass('no-scroll');
    },
    previous: function(){
        if(this.state.index == 0) return;
        this.setIndex(this.state.index - 1);
    },
    next: function(){
        if(this.state.index + 1 >= this.props.images.length) return;
        this.setIndex(this.state.index + 1);
    },
    renderImage: function(){
        if(this.state.image){
            var imageStyle = { maxHeight: $(window).height() - 200 };
            return (
                <div className="slide">
                    <img className="slide-image" style={imageStyle} src={this.state.image} />
                    <p className="slide-caption">{this.state.caption}</p>
                    {this.renderControls()}
                </div>
            );
        }
    },
    renderControls: function(){
        if(this.props.images.length > 1){
            return (
                <div className="navigation">
                    <a className="prev-slide" href="#"><i className="fa fa-chevron-left"></i></a>
                    <span className="curr-slide">{this.state.index + 1}</span> &nbsp;of&nbsp; <span className="total-slide">{this.props.images.length}</span>
                    <a className="next-slide" href="#"><i className="fa fa-chevron-right"></i></a>
                </div>
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
            <div className={'slideshow ' + visible}>
                <div className="image-container">
                    <div className="image-inner">
                    {this.renderImage()}
                    </div>
                </div>
            </div>
        );
    }
});


var Galleries = React.createClass({
    render: function(){
        var galleries = this.props.galleries.map(function(gallery, i){
            return (<Gallery key={i} selector={gallery.selector} images={gallery.list} imagesTable={gallery.table} />);
        })
        return (<div>{galleries}</div>);
    }
})

function gatherImages(gallery){
    var selector = gallery ? '#gallery-' + gallery + ' .gallery-thumb' : '.article-attachment';
    var images = [];
    var imagesTable = {};
    var n = 0;
    $(selector).each(function(){
        var id = $(this).data('id');
        images.push({
            'id': id,
            'url': $(this).data('url'),
            'caption': $(this).data('caption'),
            'credit': $(this).data('credit'),
        });
        imagesTable[id] = n;
        n++;
    });
    return {
        'list': images,
        'table': imagesTable,
        'selector': selector
    }
}

function renderGalleries(){

    var galleries = [];

    galleries.push(gatherImages());

    $('.gallery-attachment').each(function(){
        galleries.push(gatherImages($(this).data('id')));
    });

    var gallery = React.render(
        <Galleries galleries={galleries} />,
        document.getElementById('gallery')
    );
}

renderGalleries();