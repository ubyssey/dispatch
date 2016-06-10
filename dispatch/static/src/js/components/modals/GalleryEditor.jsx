var React = require('react');
var Image = require('./Image.jsx');
var GalleryImageMeta = require('./GalleryImageMeta.jsx');
var ImageStore = require('../ImageStore.js');

var GalleryEditor = React.createClass({
    getInitialState: function(){
        this.ImageStore = ImageStore();
        this.ImageStore.dump(this.props.gallery.images);
        return {
            activeImage: false,
            title: this.props.gallery.title,
            images: this.ImageStore,
        }
    },
    addTrigger: function(trigger, callback){
        this.callbacks[trigger.selector] = callback;
        this.addTriggerEvent(trigger);
    },
    addTriggerEvent: function(trigger){
        $(trigger).click(function(e){
            e.preventDefault();
            this.setState({ currentTrigger: trigger });
            this.open();
        }.bind(this));
    },
    addImagesHandler: function(event){
        event.preventDefault();
        this.props.hide();
        this.props.imageManager.openWithCallback(this.addImages, { multiple: true, backText: "Back to gallery", backHandler: this.cancelAddImages });
    },
    cancelAddImages: function(){
        this.props.show();
    },
    addImages: function(images){
        var attachments = [];
        for(var i = 0; i < images.length; i++){
            var image = images[i];
            image.caption = "";
            attachments.push(image);
        }
        this.ImageStore.append(attachments);
        this.setState({
            images: this.ImageStore
        });
        this.props.show();
    },
    handleCancel: function(event){
        event.preventDefault();
        this.props.cancelHandler();
    },
    openWithCallback: function(callback, multiple){
        this.multiple = multiple ? multiple : false;
        this.callback = callback;
        this.open();
    },
    updateTitle: function(event){
        this.setState({ title: event.target.value });
    },
    selectImage: function(id){
        this.setState({ activeImage: id });
    },
    deleteImage: function(attachment_id){
        this.ImageStore.removeAttachment(attachment_id);
        this.setState({ images: this.ImageStore });
    },
    updateImage: function(attachment_id, data){
        this.ImageStore.updateAttachment(attachment_id, data);
        this.setState({ images: this.ImageStore });
    },
    renderImageMeta: function(){
        if(this.state.activeImage){
            var image = this.ImageStore.getImage(this.state.activeImage);
            if(image){
                return (<GalleryImageMeta image={image} updateHandler={this.updateImage} deleteHandler={this.deleteImage} />);
            }
        }
    },
    handleUpdate: function(event){
        event.preventDefault();

        var images = this.ImageStore.all();
        var attachments = [];

        for(var i = 0; i < images.length; i++){
            var image = images[i];
            attachments.push({
                image_id: image.id,
                caption: image.caption
            });
        }

        var values = {
            title: this.state.title,
            attachment_json: JSON.stringify(attachments)
        };

        dispatch.update('gallery', this.props.gallery.id, values, function(data){
            this.props.updateHandler(this.props.gallery.id, data);
            return this.props.cancelHandler();
        }.bind(this));
    },
    render: function() {

        var images = this.state.images.all().map(function(image, i){
            return (<Image key={i} id={image.id} thumb={image.url} selected={this.state.activeImage == image.id} onClickHandler={this.selectImage} />);
        }.bind(this));

        return (
            <div className="body">
                <div id="image-manager" className="content">
                    <div className="header">
                        <nav>
                            <div className="left">
                                <button className="dis-button" onClick={this.handleCancel}><i className="fa fa-chevron-left"></i>Back to galleries</button>
                            </div>
                            <div className="middle">
                                <input type="text" className="dis-input gallery-title" placeholder="Gallery title" onChange={this.updateTitle} value={this.state.title} />
                            </div>
                            <div className="right">
                                <button className="dis-button" onClick={this.addImagesHandler}>Add Images</button>
                            </div>
                        </nav>
                    </div>
                    <div id="image-catalog" className="content-area">
                        <div className="image-catalog-container small" ref="scrollable" onScroll={this.onScroll}>
                            <ul className="image-results">{images}</ul>
                        </div>
                        {this.renderImageMeta()}
                    </div>
                    <div className="footer">
                        <nav>
                            <div className="pull-right">
                                <button className="dis-button green" onClick={this.handleUpdate}>Update gallery</button>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = GalleryEditor;