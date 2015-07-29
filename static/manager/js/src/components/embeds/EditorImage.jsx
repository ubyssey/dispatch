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
            credit: this.props.data.custom_credit
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
        this.setState({ caption: event.target.value });
    },
    handleCreditChange: function(event){
        this.setState({ credit: event.target.value });
    },
    getJSON: function(){
        return {
            type: 'image',
            data: {
                attachment_id: this.props.data.attachment_id ? this.props.data.attachment_id : false,
                subtype: this.state.type,
                image: this.state.image,
                caption: this.state.caption,
                custom_credit: this.state.credit
            }
        }
    },
    render: function(){
        return (
            <div className="image basic">
                <div className="header overlay">
                    <div className="pull-left">
                        <h4>Image</h4>
                    </div>
                    <div className="pull-right">
                        <button onClick={this.openImageManager}><i className="fa fa-pencil"></i> Change</button>
                        <button onClick={this.removeImage}><i className="fa fa-trash-o"></i> Remove</button>
                    </div>
                </div>
                <div className="image">
                    <img className="item" key={this.state.image.id} src={this.state.image.url} />
                </div>
                <div className="body">
                    <div className="field full">
                        <label>Caption</label>
                        <Textarea rows={1} placeholder="Write a caption" value={this.state.caption} onChange={this.handleCaptionChange} />
                    </div>
                    <div className="field full">
                        <label>Custom Credit</label>
                        <input type="text" onChange={this.handleCreditChange} value={this.state.credit} />
                    </div>
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