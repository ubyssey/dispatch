var React = require('react');

var GallerySlide = React.createClass({
    render: function(){
        var imageStyle = { height: $(window).height() };
        return (
            <div className={"slide " + this.props.className}>
                <img className="slide-image" style={imageStyle} src={this.props.src} />
                <p className="slide-caption">{this.props.caption}</p>
            </div>
        );
    }
});


module.exports = GallerySlide;