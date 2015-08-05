/**
 * requestAnimationFrame and cancel polyfill
 */
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                                 timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());


/**
    * super simple carousel
    * animation between panes happens with css transitions
    */
function Carousel(element)
{
  var self = this;
  element = $(element);

  var container = $(">ul", element);
  var panes = $(">ul>li", element);

  var pane_width = 0;
  var pane_height = 0;
  var pane_count = panes.length;

  var current_pane = 0;
  var carousel_bottom = 0;
  var carousel_top = 0;
  var carousel_head = 85;

  var is_expanded;

  var _ypos;


  /**
   * initial
   */
  this.init = function() {
    setPaneDimensions();

    $(window).on("load resize orientationchange", function() {
      setPaneDimensions();
      //updateOffset();
    })
  };

  /**
   * set the pane dimensions and scale the container
   */
  function setPaneDimensions() {
    pane_width = element.width();
    panes.each(function() {
      $(this).width(pane_width);
    });
    container.width(pane_width*pane_count);

    // Set start point
    carousel_top = $(window).height() - carousel_head;
    setContainerOffsetY(carousel_top);
    is_expanded = false;
  };


  this.updatePaneDimensions = function() {
    var panes = $(">ul>li", element);
    var paneWidth = panes.first().width();

    var containerWidth = paneWidth*panes.length;

    $(container).css('width', containerWidth);

    // update pane count
    pane_count = panes.length;

    // reset current pane
    this.showPane(current_pane, false);
  }


  /**
   * show pane by index
   * @param   {Number}    index
   */
  this.showPane = function(index, animate) {
    // between the bounds
    index = Math.max(0, Math.min(index, pane_count-1));
    current_pane = index;

    var offset = -((100/pane_count)*current_pane);

    setContainerOffset(offset, true);
  }

  function setContainerOffset(percent, animate) {
    container.removeClass("animate");

    if(animate) {
      container.addClass("animate");
    }

    var px = ((pane_width * pane_count) / 100) * percent;

    if(Modernizr.csstransforms3d) {
      container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
    }
    else if(Modernizr.csstransforms) {
      container.css("transform", "translate("+ percent +"%,0)");
    }
      else {
        var px = ((pane_width*pane_count) / 100) * percent;
        container.css("left", px+"px");
      }
  }

  function setContainerOffsetY(ypos, animate) {

    element.removeClass("animate");

    if (animate) {
      element.addClass("animate");
    }

    _ypos = ypos;

    if(Modernizr.csstransforms3d) {
      element.css("transform", "translate3d(0," + ypos + "px,0) scale3d(1,1,1)");
    }
    else if(Modernizr.csstransforms) {
      element.css("transform", "translate(0," + ypos + "px)");
    }
    else {
      element.css("top", ypos + "px");
    }
  }

  this.next = function() { return this.showPane(current_pane+1, true); };
  this.prev = function() { return this.showPane(current_pane-1, true); };

  this.togglePane = function(expand) {

    // TODO: 'expand'

    if (!is_expanded) {
      // Expand
      self.expand();
    } else {
      // Collapse
      self.collapse();
    }
  }

  this.expand = function() {
    setContainerOffsetY(carousel_head, true);
    is_expanded = true;
  }

  this.collapse = function() {
    setContainerOffsetY(carousel_top, true);
    is_expanded = false;
  }

  this.throttledTogglePane = _.debounce(self.togglePane, 100);

  this.throttledShowPane = _.debounce(function() {
     self.expand();
  }, 100);

  this.throttledHidePane = _.debounce(function() {
    self.collapse();
  }, 100);

  function handleHammer(ev) {

    // disable browser scrolling
    ev.gesture.preventDefault();

    switch(ev.type) {
      case 'dragright':
      case 'dragleft':
        // stick to the finger
        var pane_offset = -(100/pane_count) * current_pane;
        var drag_offset = ((100/pane_width) * ev.gesture.deltaX) / pane_count;

        // slow down at the first and last pane
        if((current_pane == 0  && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
           (current_pane == pane_count-1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
          drag_offset *= .4;
        }

        setContainerOffset(drag_offset + pane_offset);
        break;

      case 'swipeleft':
        self.next();
        ev.gesture.stopDetect();
        break;

      case 'swiperight':
        self.prev();
        ev.gesture.stopDetect();
        break;

      case 'release':
        // Left & Right
        // more then 50% moved, navigate
        if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
          if(ev.gesture.direction == 'right') {
            self.prev();
          } else {
            self.next();
          }
        }
        else {
          self.showPane(current_pane, true);
        }

        if ((ev.gesture.direction == "up") || (ev.gesture.direction == "down")) {

          var windowHalf = ($(window).height() - (carousel_head * 2)) / 4;

          if(Math.abs(ev.gesture.deltaY) > windowHalf) {
            if (is_expanded) {
              self.collapse();
            } else {
              self.expand();
            }
          }
          else {
            if (is_expanded) {
              self.expand();
            } else {
              self.collapse();
            }
          }
        }

        break;

      case 'tap':
        self.throttledTogglePane();
        ev.gesture.stopDetect();
        break;

      case 'dragup':
        var drag_offset = carousel_top + ev.gesture.deltaY;

        if (is_expanded) {
          drag_offset = carousel_head + ev.gesture.deltaY;
//           drag_offset *= .4;
        }

        setContainerOffsetY(drag_offset);
        break;

      case 'dragdown':
        var drag_offset = carousel_head + ev.gesture.deltaY;

        if (!is_expanded) {
          console.log('not expanded', carousel_top, ev.gesture.deltaY)
          drag_offset = carousel_top + ev.gesture.deltaY;
        }

        setContainerOffsetY(drag_offset);
        break;

      case 'swipeup':
        console.log('swipeup')
        self.throttledShowPane();
        ev.gesture.stopDetect();
        break;

      case 'swipedown':
        console.log('swipedown')
        self.throttledHidePane();
        ev.gesture.stopDetect();
        break;
    }
  }

  element.hammer({ drag_lock_to_axis: true })
  .on("tap release dragleft dragright swipeleft swiperight dragup dragdown swipeup swipedown", handleHammer);
}

var carousel = new Carousel("#carousel");
carousel.init();