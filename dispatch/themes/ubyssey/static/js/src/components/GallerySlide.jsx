var GallerySlide = React.createClass({
    render: function(){
        var slideStyle = { width: this.props.width };
        var imageStyle = { backgroundImage: "url('" + this.props.src + "')" };

        var caption = (<p className="slide-caption" dangerouslySetInnerHTML={{__html: this.props.caption}}></p>);
				var credit = (<p className="slide-credit" dangerouslySetInnerHTML={{__html: this.props.credit}}></p>);
        return (
            <li className="slide" style={slideStyle}>
                <div className="inner">
                    <div className="image">
                        <div>
                            <div className="img" style={imageStyle}></div>
                        </div>
                    </div>
                    { this.props.caption ? caption : null}
										{ this.props.credit ? credit : null}
                </div>
            </li>
        );
    }
});

module.exports = GallerySlide;
