var React = require('react');
var Image = require('./Image.jsx');

var GalleryEditor = React.createClass({
    getInitialState: function(){
        return {
            activeImage: false,
            title: this.props.gallery.title
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
        this.setState({
            activeImage: id,
        });
    },
    deleteImage: function(id){
        //
    },
    updateImage: function(data){
        //this.ImageStore.updateImageWithData(data);
    },
    renderImageMeta: function(){

    },
    render: function() {

        var images = this.props.gallery.images.map(function(image, i){
            return (<Image key={i} id={image.id} thumb={image.url} selected={this.state.activeImage == image.id} />);
        }.bind(this));

        return (
            <div className="body">
                <div id="image-manager" className="content">
                    <div className="header">
                        <nav>
                            <div className="left">
                                <button className="dis-button" onClick={this.handleCancel}><i className="fa fa-chevron-left"></i> &nbsp;Back to galleries</button>
                            </div>
                            <div className="middle">
                                <input type="text" className="dis-input gallery-title" placeholder="Gallery title" onChange={this.updateTitle} value={this.state.title} />
                            </div>
                            <div className="right">
                                <button className="dis-button">Add Images</button>
                            </div>
                        </nav>
                    </div>
                    <div id="image-catalog" className="content-area">
                        <div className="image-catalog-container" ref="scrollable" onScroll={this.onScroll}>
                            <ul className="image-results">{images}</ul>
                        </div>
                        {this.renderImageMeta()}
                    </div>
                    <div className="footer">
                        <nav>
                            <div className="pull-right">
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = GalleryEditor;