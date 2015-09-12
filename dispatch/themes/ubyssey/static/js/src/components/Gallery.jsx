var React = require('react');
var LinkedList = require('../modules/LinkedList.js');
var GallerySlide = require('./GallerySlide.jsx');
var Hammer = require('hammerjs');
//var Modernizr = require('modernizr');

var Gallery = React.createClass({
    getInitialState: function(){
        return {
            active: null,
            index: false,
            image: false,
            visible: false,
            deltax: 0,
            slide_width: $(window).width()
        }
    },
    componentWillMount: function(){
        this.images = LinkedList(this.props.images);
    },
    componentDidMount: function(){

        //this.preloadImages();

        this.setupEventListeners();
        this.addSlideTrigger(this.props.trigger);
        this.initSlider();
    },
    initSlider: function(){

        var element = this.refs.gallery.getDOMNode();

        this.element = $(element);

        this.container = $("ul.slides", this.element);

        this.panes = $("li.slide", this.element);

        this.pane_width = 0;
        this.pane_height = 0;
        this.pane_count = this.panes.length;

        this.current_pane = 0;

        this.slideCallback = this.next;

        this.setPaneDimensions();

        $(window).on("load resize orientationchange", function() {
            this.setPaneDimensions();
            this.setState({ slide_width: $(window).width() });
          //updateOffset();
        }.bind(this));

        var hammertime = new Hammer(element, { drag_lock_to_axis: true,
            recognizers: [
                [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL, threshold: 1, velocity: 0.1 }],
                [Hammer.Pan, { threshold: 5 }],
            ]
        });

        hammertime.on("panend pancancel panleft panright swipeleft swiperight", this.handleHammer);

        /* From Modernizr */
        function whichTransitionEvent(){
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
              'transition':'transitionend',
              'OTransition':'oTransitionEnd',
              'MozTransition':'transitionend',
              'WebkitTransition':'webkitTransitionEnd'
            }

            for(t in transitions){
                if( el.style[t] !== undefined ){
                    return transitions[t];
                }
            }
        }

        /* Listen for a transition! */
        var transitionEvent = whichTransitionEvent();
        transitionEvent && element.addEventListener(transitionEvent, function() {
            //this.slideCallback();
        }.bind(this));

    },
    setPaneDimensions: function(){
        this.pane_width = $(window).width();
        this.panes.each(function() {
          $(this).width(this.pane_width);
        });

        this.container.width((this.pane_width+15)*this.pane_count);
    },
    updatePaneDimensions: function(){
        this.container = $("ul.slides", this.element);

        this.panes = $("li.slide", this.element);

        this.pane_width = $(window).width();

        this.panes.each(function() {
          $(this).width(this.pane_width);
        });

        var containerWidth = this.pane_width*this.panes.length;

        $(this.container).css('width', containerWidth);

        // update pane count
        this.pane_count = this.panes.length;

        // reset current pane
        this.showPane(this.current_pane, false);
    },
    showPane: function(index, animate) {
        // between the bounds
        index = Math.max(0, Math.min(index, this.pane_count-1));

        this.current_pane = index;

        var offset = -((100/this.pane_count)*this.current_pane);

        this.setContainerOffset(offset, true);
    },
    setContainerOffset: function(percent, animate){

        this.container.removeClass("animate");

        if(animate) {
          this.container.addClass("animate");
        }
        this.container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");

    },
    nextSlide: function() {
        if(this.state.active && this.state.active.next)
            this.setState({ active: this.state.active.next});
        return this.showPane(this.current_pane+1, true);
    },
    prevSlide: function() {
        if(this.state.active && this.state.active.prev)
            this.setState({ active: this.state.active.prev});
        return this.showPane(this.current_pane-1, true);
    },
    handleHammer: function(ev) {

        // disable browser scrolling
        //ev.preventDefault();

        switch(ev.type) {
            case 'panright':
            case 'panleft':
                console.log('dragging');
                // stick to the finger
                var pane_offset = -(100/this.pane_count) * this.current_pane;
                var drag_offset = ((100/this.pane_width) * ev.deltaX) / this.pane_count;

                // slow down at the first and last pane
                if((this.current_pane == 0  && ev.direction == Hammer.DIRECTION_RIGHT) ||
                   (this.current_pane == this.pane_count-1 && ev.direction == Hammer.DIRECTION_LEFT)) {
                  drag_offset *= .4;
                }

                this.setContainerOffset(drag_offset + pane_offset);
                break;

          case 'swipeleft':
              console.log('swipe left');
            this.nextSlide();
            //ev.stopDetect();
            break;

          case 'swiperight':
              console.log('swipe right');
            this.prevSlide();
            //ev.stopDetect();
            break;

            case 'panend':
            case 'pancancel':
                // Left & Right
                // more then 1/3 moved, navigate
                if(Math.abs(ev.deltaX) > this.pane_width/3) {
                  if(ev.direction == Hammer.DIRECTION_RIGHT) {
                    this.prevSlide();
                  } else {
                    this.nextSlide();
                  }
                }
                else {
                  this.showPane(this.current_pane, true);
                }

                break;
        }
    },
    swipeSlide: function(dir){
        var pos;
        var callback = false;
        if(dir == 'next'){
            callback = this.next;
            pos = -($(window).width());
        } else if(dir == 'previous') {
            callback = this.previous;
            pos = $(window).width();
        } else {
            pos = 0;
        }

        $('.slides').animate({ left: pos }, 150, function(){
            if(callback){
                callback(function(){
                    $('.slides').css({ left: 0 });
                });
            }
        });
    },
    setupEventListeners: function(){

        // Keyboard controls
        key('left', this.prevSlide);
        key('right', this.nextSlide);
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
//        $(this.getDOMNode()).mouseup(function (e)
//        {
//            var container = $(this.getDOMNode()).find(".slide");
//            if (!container.is(e.target) && container.has(e.target).length === 0)
//            {
//                this.close();
//                $('body').removeClass('no-scroll');
//            }
//        }.bind(this));

    },
    addSlideTrigger: function(target){
        console.log('adding slide trigger for ' + target);
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
    preloadImages: function(){
        var loaded = [];
        this.props.images.map(function(image, i){
            loaded[i] = new Image();
            loaded[i].src = image.url;
        });
    },
    getImage: function(imageId){
        var index = this.props.imagesTable[imageId];
        return this.props.images[index];
    },
    getActiveImage: function(imageId){
        var active = this.images;
        while(active){
            if(active.data.id == imageId)
                return active;
            active = active.next;
        }
        return null;
    },
    setCurrentImage: function(imageId){
        this.setState({ active: this.getActiveImage(imageId)}, this.updatePaneDimensions);
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
    previous: function(callback){
        if(!this.state.active || !this.state.active.prev)
            return
        this.setState({ active: this.state.active.prev }, callback);
    },
    next: function(callback){
        if(!this.state.active || !this.state.active.next)
            return
        this.setState({ active: this.state.active.next }, callback);
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

        var slides = this.props.images.map(function(image, i){
            return (<GallerySlide key={i} index={i} width={this.state.slide_width} src={image.url} caption={image.caption} />);
        }.bind(this));

        var prev = (<div onClick={this.prevSlide} className="prev"><div><i className="fa fa-chevron-left"></i></div></div>);
        var next = (<div onClick={this.nextSlide} className="next"><div><i className="fa fa-chevron-right"></i></div></div>);

        return (
            <div className={'slideshow ' + visible}>
                <div ref="gallery" className="image-container">
                    <div onClick={this.close} className="close-slideshow"><i className="fa fa-times"></i></div>
                    <div className="gallery-container">
                        <ul className="slides" ref="slides">{slides}</ul>
                    </div>
                    { this.state.active && this.state.active.prev ? prev : null }
                    { this.state.active && this.state.active.next ? next : null }
                </div>
            </div>
        );
    }
});

module.exports = Gallery;