var React = require('react');
var EditorImage = React.createClass({
    getInitialState: function(){
        return {
            type: 'single',
            image: {
                id: this.props.data.id,
                url: this.props.data.url,
            },
            caption: this.props.data.caption ? this.props.data.caption : '',
        };
    },
    componentDidMount: function(){
        $(React.findDOMNode(this.refs.captionTextarea)).autosize();
    },
    addImage: function(image){
        console.log(image);
        this.setState({
            image: image
        });
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
                <div className="image-toolbar-container">
                    <div className="image-toolbar">
                    </div>
                </div>
                <div className="images">
                    <img onClick={this.openImageManager} className="item" key={this.state.image.id} src={this.state.image.url} />
                </div>
                <div className="image-caption">
                    <textarea placeholder="Write a caption" ref="captionTextarea" onChange={this.handleCaptionChange}>{this.state.caption}</textarea>
                </div>
            </div>
            );
    }
});


var factory = function(options){
    var manager = options.manager;
    var controller = function(node, embed){
        var component = React.render(
            <EditorImage data={embed.data} manager={manager} />,
            node
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