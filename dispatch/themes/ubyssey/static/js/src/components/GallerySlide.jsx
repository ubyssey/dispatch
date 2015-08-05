var React = require('react');

var GallerySlide = React.createClass({
    render: function(){
        var slideStyle = { width: this.props.width, height: $(window).height() };
        return (
            <li className={"slide " + this.props.className} style={slideStyle} >
                <img className="slide-image" src={this.props.src} />
                <p className="slide-caption">{this.props.caption}</p>
            </li>
        );
    }
});


module.exports = GallerySlide;