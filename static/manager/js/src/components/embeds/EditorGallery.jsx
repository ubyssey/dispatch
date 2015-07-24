require('babel/polyfill');

var React = require('react');
var Textarea = require('react-textarea-autosize');
var ImageStore = require('../ImageStore.js');

var EditorGallery = React.createClass({
    getInitialState: function(){
        return {
            images: this.props.data,
        };
    },
    addImages: function(images){
        this.setState({
            image: image
        });
    },
    removeImage: function(){
        this.props.remove();
    },
    openImageManager: function(){
        this.props.manager.openWithCallback(function(items){
            this.addImages(items);
        }.bind(this), { many: true });
    },
    handleCaptionChange: function(event){
        this.setState({
            caption: event.target.value,
        });
    },
    getJSON: function(){
        return {
            type: 'image',
            data: {
                attachment_id: this.props.data.attachment_id ? this.props.data.attachment_id : false,
                subtype: this.state.type,
                image: this.state.image,
                caption: this.state.caption,
            }
        }
    },
    render: function(){
        return (
            <div className="image">
                <div className="images">
                    <img className="item" key={this.state.image.id} src={this.state.image.url} />
                </div>
                <div className="meta">
                    <div className="caption">
                        <Textarea className="plain" minRows={1} placeholder="Write a caption" value={this.state.caption} onChange={this.handleCaptionChange} />
                    </div>
                    <ul className="controls">
                        <li onClick={this.removeImage}>Remove</li>
                        <li onClick={this.openImageManager}>Change</li>
                    </ul>
                </div>
            </div>
            );
    }
});


var factory = function(options){
    var controller = function(line, embed){
        var component = React.render(
            <EditorGallery data={embed.data} galleryManager={options.galleryManager} remove={line.remove} />,
            line.node
        );
        return component;
    }
    return {
        controller: controller,
        trigger: function(callback){
            options.galleryManager.openWithCallback(callback);
        }
    };
}

module.exports = factory;