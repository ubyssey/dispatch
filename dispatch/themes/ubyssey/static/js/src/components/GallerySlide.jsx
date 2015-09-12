var React = require('react');

var GallerySlide = React.createClass({
    render: function(){
        var slideStyle = { width: $(window).width() };
        var imageStyle = {};
        if($(window).height() > $(window).width())
            imageStyle = { width: '100%', height: 'auto' };

        var caption = (<p className="slide-caption">{this.props.caption}</p>);
        return (
            <li className="slide" style={slideStyle}>
                <div className="inner">
                    <div className="image">
                        <div>
                            <img src={this.props.src} style={imageStyle} />
                        </div>
                    </div>
                    { this.props.caption ? caption : null}
                </div>
            </li>
        );
    }
});

module.exports = GallerySlide;