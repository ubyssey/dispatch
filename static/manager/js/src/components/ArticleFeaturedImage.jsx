var React = require('react');
var Textarea = require('react-textarea-autosize');

var ArticleFeaturedImage = React.createClass({
    getInitialState: function(){
       return this.props.data ? this.props.data : {};
    },
    selectImage: function(e){
        e.preventDefault();
        this.props.manager.openWithCallback(function(items){
            this.updateImage(items[0]);
        }.bind(this));
    },
    updateImage: function(image){
        this.setState({
            id: image.id,
            url: image.url,
        }, function(){
            this.save();
        })
    },
    save: function(){
        return this.props.updateHandler(this.props.name, this.state);
    },
    updateCaption: function(event){
        this.setState({
            caption: event.target.value,
        }, function(){
            this.save();
        });
    },
    renderImage: function(){
        return (
            <div className="featured-image">
                <img onClick={this.selectImage} src={this.state.url} />
                <div className="field full">
                    <label>Caption</label>
                    <Textarea rows={2} placeholder="Add a caption"  value={this.state.caption} onChange={this.updateCaption}></Textarea>
                </div>
            </div>
            )
    },
    render: function(){
        if(this.state.url){
            return this.renderImage();
        } else {
            return (
                <div>
                    <button onClick={this.selectImage}>Set featured image</button>
                </div>
                )
        }
    }
});

module.exports = ArticleFeaturedImage;