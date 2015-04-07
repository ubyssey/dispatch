var EditorImage = React.createClass({
    getInitialState: function(){
        return {
            type: 'single',
            images: this.props.data.images,
            caption: this.props.data.caption ? this.props.data.caption : '',
        };
    },
    componentDidMount: function(){
        $(React.findDOMNode(this.refs.captionTextarea)).autosize();
    },
    addImage: function(image){
        if (this.state.images.length > 1)
            return
        var image = {
            id: image.id,
            src: image.url,
        }
        var images = this.state.images;
        images.push(image);
        this.setState({
            images: images,
        });
    },
    openImageManager: function(){
        this.props.manager.openWithCallback(function(items){
            this.addImage(items[0]);
        }.bind(this));
    },
    toggleType: function(e){
        e.preventDefault();
        var newType;
        if (this.state.type == 'single')
            newType = 'double';
        else
            newType = 'single';
        this.setState({
            type: newType,
        });
    },
    handleCaptionChange: function(event){
        this.setState({
            caption: event.target.value,
        });
    },
    onMouseDown: function(){
        this.mouseIsDownOnCalendar = true;
    },
    asShortcode: function(){
        var tag_name;
        if(this.props.temp)
            tag_name = "temp_image";
        else
            tag_name = "image";
        return "["+tag_name+" " + this.state.images[0].id + "]";
    },
    getJSON: function(){
        return {
            type: 'image',
            data: {
                attachment_id: this.props.data.attachment_id ? this.props.data.attachment_id : false,
                subtype: this.state.type,
                images: this.state.images,
                caption: this.state.caption,
            }
        }
    },
    render: function(){
        var imageNodes = this.state.images.map(function (image) {
            return (
                <img className="item" key={image.id} src={image.src} />
                );
        });
        var showAddButton = this.state.images.length == 1 && this.state.type == 'double' ? 'show-add-button' : '';
        return (
            <div className="image" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
                <div className="image-toolbar-container">
                    <div className="image-toolbar">
                        <a href="#" onClick={this.toggleType}>Type</a>
                    </div>
                </div>
                <div className={'images ' + this.state.type + ' ' + showAddButton}>
                    {imageNodes}
                    <div className="add-image" ref="addImage">
                        <a href="#" onClick={this.openImageManager}>Add Image</a>
                    </div>
                </div>
                <div className="image-caption">
                    <textarea placeholder="Write a caption" ref="captionTextarea" onChange={this.handleCaptionChange}>{this.state.caption}</textarea>
                </div>
            </div>
            );
    }
});

module.exports = EditorImage;