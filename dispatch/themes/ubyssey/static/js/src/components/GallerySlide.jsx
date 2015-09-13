var GallerySlide = React.createClass({
    render: function(){
        var slideStyle = { width: this.props.width };
        var imageStyle = { backgroundImage: "url('" + this.props.src + "')" };

        var caption = (<p className="slide-caption">{this.props.caption}</p>);
        return (
            <li className="slide" style={slideStyle}>
                <div className="inner">
                    <div className="image">
                        <div>
                            <div className="img" style={imageStyle}></div>
                        </div>
                    </div>
                    { this.props.caption ? caption : null}
                </div>
            </li>
        );
    }
});

module.exports = GallerySlide;