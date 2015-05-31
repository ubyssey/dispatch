var React = require('react');

var ArticleFeaturedImage = React.createClass({
    getInitialState: function(){
       return {
           image: this.props.image ? this.props.image : false,
       }
    },
    selectImage: function(e){
        e.preventDefault();
        this.props.manager.openWithCallback(function(items){
            this.setImage(items[0]);
        }.bind(this));
    },
    setImage: function(image){
        this.setState({
            image: image,
        });
    },
    renderImage: function(){
        return (
            <img src={this.state.image.url} />
            )
    },
    render: function(){
        if(this.state.image){
            return this.renderImage();
        } else {
            return (
                <button onClick={this.selectImage}>Set featured image</button>
                )
        }
    }
});

module.exports = ArticleFeaturedImage;