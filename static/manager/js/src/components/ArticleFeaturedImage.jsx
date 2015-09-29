var React = require('react');
var Textarea = require('react-textarea-autosize');

var ArticleFeaturedImage = React.createClass({
    selectImage: function(e){
        e.preventDefault();
        this.props.manager.openWithCallback(function(items){
            this.updateImage(items[0]);
        }.bind(this));
    },
    updateImage: function(image){
        var feat_image = this.props.featured_image;
        feat_image.id = image.id;
        feat_image.url = image.url;
        return this.props.updateHandler(this.props.name, feat_image);
    },
    updateCaption: function(event){
        return this.update('caption', event.target.value);
    },
    updateCredit: function(event){
        return this.update('credit', event.target.value);
    },
    update: function(field, data){
        var feat_image = this.props.featured_image;
        feat_image[field] = data;
        return this.props.updateHandler(this.props.name, feat_image);
    },
    renderImage: function(){
        return (
            <div className="featured-image">
                <img onClick={this.selectImage} src={this.props.featured_image.url} />
                <div className="field full">
                    <label>Caption</label>
                    <Textarea rows={2} placeholder="Add a caption" value={this.props.featured_image.caption} onChange={this.updateCaption}></Textarea>
                </div>
                <div className="field full">
                    <label>Custom credit</label>
                    <Textarea rows={2} value={this.props.featured_image.credit} onChange={this.updateCredit}></Textarea>
                </div>
            </div>
            );
    },
    render: function(){
        if(this.props.featured_image){
            return this.renderImage();
        } else {
            return (
                <div>
                    <button onClick={this.selectImage}>Set featured image</button>
                </div>
                );
        }
    }
});

module.exports = ArticleFeaturedImage;