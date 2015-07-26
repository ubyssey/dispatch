require('babel/polyfill');

var React = require('react');
var Textarea = require('react-textarea-autosize');

var EditorImage = React.createClass({
    getInitialState: function(){
        return {
            image: {
                id: this.props.data.id,
                url: this.props.data.url,
            },
            caption: this.props.data.caption ? this.props.data.caption : '',
        };
    },
    addImage: function(image){
        this.setState({
            image: image
        });
    },
    removeImage: function(){
        this.props.remove();
    },
    openImageManager: function(){
        this.props.manager.openWithCallback(function(items){
            this.addImage(items[0]);
        }.bind(this));
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
    var manager = options.manager;
    var controller = function(line, embed){
        var component = React.render(
            <EditorImage data={embed.data} manager={manager} remove={line.remove} />,
            line.node
        );
        return component;
    }
    return {
        controller: controller,
        trigger: function(callback){
            manager.openWithCallback(function(items){
                var image = items[0];
                var data = {
                    id: image.id,
                    url: image.url,
                }
                callback(data);
            });
        }
    };
}

module.exports = factory;