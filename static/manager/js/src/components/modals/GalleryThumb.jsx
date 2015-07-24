var React = require('react');

var GalleryThumb = React.createClass({
    onClick: function(){
        this.props.onClickHandler(this.props.gallery.id);
    },
    getThumb: function(){
        if(this.props.gallery.images.length != 0)
            return this.props.gallery.images[0].url;
        else
            return "";
    },
    render: function(){
        var style = {backgroundImage: "url('" + this.getThumb() + "')"};
        return (
            <li className={"catalog-gallery" + (this.props.selected ? " selected" : "")} onClick={this.onClick}>
                <div style={style}></div>
                <span>{this.props.gallery.title}</span>
            </li>
        );
    }
});

module.exports = GalleryThumb;
