var React = require('react');
var ImageStore = require('../ImageStore.js');
var ImageMeta = require('./ImageMeta.jsx');
var ImageDropzone = require('./ImageDropzone.jsx');

var ImageManager = React.createClass({
    getInitialState: function(){
        return {
            visible: false,
            activeImage: false,
            selected: [],
            initialized: false,
            currentTrigger: false,
            nextImages: false,
            loadingMore: false,
            images: ImageStore(),
            query: "",
        }
    },
    componentDidMount: function() {

        this.ImageStore = this.state.images;
        var func = this.selectImage;

        // Clicking outside container
        $(this.getDOMNode()).mouseup(function (e)
        {
            var container = $(this.getDOMNode()).find(".content");
            if (!container.is(e.target) && container.has(e.target).length === 0)
            {
                this.close();
                $('body').removeClass('no-scroll');
            }
        }.bind(this));

        // Initalize callbacks object
        this.callbacks = {};
        this.callback = false;
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
    processOptions: function(options){
        var options = options ? options : {};

        this.multiple = options.multiple ? options.multiple : false;

        options.backText = options.backText ? options.backText : false;

        this.backHandler = options.backHandler;

        this.setState({
            backText: options.backText,
        });
    },
    openWithCallback: function(callback, options){
        this.processOptions(options);

        this.callback = callback;
        this.open();
    },
    open: function(){
        if(!this.state.initialized){
            dispatch.search("image", {'ordering': '-created_at', 'limit': 30}, function(data){
                this.ImageStore.dump(data.results);
                this.setState({
                    images: this.ImageStore,
                    initialized: true,
                    visible: true,
                    nextImages: data.next,
                });
            }.bind(this));
        } else {
            this.setState({
                visible: true,
                selected: [],
            })
        }
    },
    close: function(){
        this.setState({ visible: false });
    },
    handleBack: function(){
        this.close();
        this.backHandler();
    },
    insertImage: function(){
        if(this.callback) {
            this.callback(this.ImageStore.getImages(this.state.selected));
            this.callback = false;
        } else {
            this.callbacks[this.state.currentTrigger.selector](this.ImageStore.getImages(this.state.selected));
        }
        this.close();
    },
    selectImage: function(id){
        if(this.multiple){
            var selected = this.state.selected;
            selected.push(id);
        } else {
            var selected = [id];
        }
        this.setState({
            activeImage: id,
            selected: selected,
        });
    },
    deleteImage: function(id){
        dispatch.remove('image', id, function(){
            this.ImageStore.removeImage(id);
            this.setState({
                activeImage: false,
                images: this.ImageStore,
            });
        }.bind(this));
    },
    addFile: function(file, dataUrl){
        this.ImageStore.addTemp(file.name, dataUrl);
        this.reloadStore();
    },
    onUpload: function(file, image){
        this.ImageStore.replaceTemp(file.name, image);
        this.reloadStore();
    },
    updateProgress: function(file, progress, bytesSent){
        this.ImageStore.updateProgress(file.name, progress);
        this.reloadStore();
    },
    reloadStore: function(){
        this.setState({
            images: this.ImageStore,
        });
    },
    updateImage: function(data){
        this.ImageStore.updateImageWithData(data);
        this.reloadStore();
    },
    onScroll: function(scroll){
        var scrollable = $(this.refs.scrollable.getDOMNode());
        var end = scrollable.children().first().innerHeight();
        var pos = scrollable.scrollTop() + scrollable.height();
        if(pos > end - 100 && !this.state.loadingMore){
            this.loadMore();
        }
    },
    loadMore: function(){
        if(this.state.nextImages){
            this.setState({ loadingMore: true });
            dispatch.getNext(this.state.nextImages, function(data){
                this.ImageStore.append(data.results);
                this.setState({
                    images: this.ImageStore,
                    loadingMore: false,
                    nextImages: data.next,
                });
            }.bind(this));
        }
    },
    searchImages: function(event){
        this.setState({
            activeImage: false,
            query: event.target.value,
        });
        dispatch.search("image", {'q': event.target.value, 'ordering': '-created_at', 'limit': 30}, function(data){
            this.ImageStore.dump(data.results);
            this.setState({
                images: this.ImageStore,
								nextImages: data.next,
            });
        }.bind(this));
    },
    renderImageMeta: function(){
        if ( this.state.activeImage ){
            var image = this.ImageStore.getImage(this.state.activeImage);
            return ( <ImageMeta image={image} onDelete={this.deleteImage} onUpdate={this.updateImage} /> );
        }
    },
    render: function() {

        if( this.state.visible ){
            var visible = "visible";
        } else {
            var visible = "";
        }

        var backButton = (<button className="dis-button" onClick={this.handleBack}><i className="fa fa-chevron-left"></i>{this.state.backText}</button>);

        return (
            <div className={'modal image-manager ' + visible}>
                <div className="body">
                    <div id="image-manager" className="content">
                        <div className="header">
                            <nav>
                                {this.state.backText ? backButton : null}
                                <button className="dis-button upload-images">Upload &nbsp;<i className="fa fa-upload"></i></button>
                                <div className="pull-right">
                                    <input type="text" className="dis-input image-search" placeholder="Search" onChange={this.searchImages} value={this.state.query} />
                                </div>
                            </nav>
                        </div>
                        <div id="image-catalog" className="content-area">
                            <div className="image-catalog-container small" ref="scrollable" onScroll={this.onScroll}>
                                <ImageDropzone url={dispatch.getModelURL('image')} paramName={'img'} loadMode={this.loadMore} addFile={this.addFile} onClickHandler={this.selectImage} onUpload={this.onUpload} updateProgress={this.updateProgress} clickable={'.upload-images'} images={this.state.images.all()} selected={this.state.selected} />
                            </div>
                            {this.renderImageMeta()}
                        </div>
                        <div className="footer">
                            <nav>
                                <div className="pull-right">
                                    <span className="selected-text">{this.state.selected.length} images selected</span>
                                    <button className="dis-button insert-image" onClick={this.insertImage}>Insert</button>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ImageManager;