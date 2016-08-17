var React = require('react');
var GalleryStore = require('../stores/ItemStore.js');
var GalleryEditor = require('./GalleryEditor.jsx');
var GalleryThumb = require('./GalleryThumb.jsx');

var GalleryManager = React.createClass({
    getInitialState: function(){
        return {
            visible: false,
            activeGallery: false,
            selected: [],
            initialized: false,
            currentTrigger: false,
            nextImages: false,
            loadingMore: false,
            galleries: GalleryStore(),
            query: "",
        }
    },
    componentDidMount: function() {

        this.GalleryStore = this.state.galleries;

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
    openWithCallback: function(callback){
        this.callback = callback;
        this.open();
    },
    open: function(){
        if(!this.state.initialized){
            dispatch.search("gallery", {'ordering': '-created_at', 'limit': 30}, function(data){
                this.GalleryStore.dump(data.results);
                this.setState({
                    galleries: this.GalleryStore,
                    initialized: true,
                    visible: true,
                    nextGalleries: data.next,
                });
            }.bind(this));
        } else {
            this.setState({
                visible: true,
                selected: false,
            })
        }
    },
    close: function(){
        this.setState({ visible: false });
    },
    show: function(){
        this.setState({ visible: true });
    },
    hide: function(){
        this.setState({ visible: false });
    },
    handleEditGallery: function(event){
        event.preventDefault();
        if(this.state.activeGallery){
            this.setState({ editing: true });
        }
    },
    handleCreateGallery: function(event){
        event.preventDefault();
        this.setState({ visible: false }, function(){
            this.props.imageManager.openWithCallback(this.createGallery, { multiple: true, backText: "Back to galleries", backHandler: this.cancelCreateGallery });
        });
    },
    createGallery: function(items){
        this.setState({ visible: true });
        var attachments = [];

        for(var i = 0; i < items.length; i++){
            attachments.push({
                image_id: items[i].id,
                caption: ""
            });
        }

        dispatch.add('gallery', {title: "New Gallery", attachment_json: JSON.stringify(attachments)}, function(data){
            this.GalleryStore.prepend(data);
            this.setState({ galleries: this.GalleryStore });
        }.bind(this));
    },
    cancelEditGallery: function(){
        this.setState({ editing: false });
    },
    cancelCreateGallery: function(){
        this.setState({ visible: true });
    },
    updateGallery: function(id, data){
        this.GalleryStore.update(id, data);
        this.setState({ galleries: this.GalleryStore });
    },
    insertGallery: function(){
        if(this.callback) {
            this.callback(this.GalleryStore.getItem(this.state.activeGallery));
            this.callback = false;
        } else {
            this.callbacks[this.state.currentTrigger.selector](this.GalleryStore.getItem(this.state.activeGallery));
        }
        this.close();
    },
    selectGallery: function(id){
        var selected = id;
        this.setState({
            activeGallery: id,
            selected: selected,
        });
    },
    handleDeleteGallery: function(event){
        this.deleteGallery(this.state.activeGallery);
    },
    deleteGallery: function(id){
        dispatch.remove('gallery', id, function(){
            this.GalleryStore.remove(id);
            this.setState({
                activeGallery: false,
                galleries: this.GalleryStore,
            });
        }.bind(this));
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
        if(this.state.nextGalleries){
            this.setState({ loadingMore: true });
            dispatch.getNext(this.state.nextGalleries, function(data){
                this.GalleryStore.append(data.results);
                this.setState({
                    galleries: this.GalleryStore,
                    loadingMore: false,
                    nextGalleries: data.next,
                });
            }.bind(this));
        }
    },
    searchGalleries: function(event){
        this.setState({
            activeGallery: false,
            query: event.target.value,
        });
        dispatch.search("gallery", {'q': event.target.value, 'ordering': '-created_at'}, function(data){
            this.GalleryStore.dump(data.results);
            this.setState({
                galleries: this.GalleryStore,
            });
        }.bind(this));
    },
    render: function() {

        if( this.state.visible ){
            var visible = "visible";
        } else {
            var visible = "";
        }

        var galleries = this.state.galleries.all().map(function(gallery, i){
            return (<GalleryThumb onClickHandler={this.selectGallery} key={i} gallery={gallery} selected={gallery.id == this.state.selected} />);
        }.bind(this));

        if(this.state.editing){
            var body = (<GalleryEditor gallery={this.GalleryStore.getItem(this.state.activeGallery)} imageManager={this.props.imageManager} show={this.show} hide={this.hide} updateHandler={this.updateGallery} cancelHandler={this.cancelEditGallery} /> );
        } else {
            var body = (
                <div className="body">
                        <div id="image-manager" className="content">
                            <div className="header">
                                <nav>
                                    <button className="dis-button green" onClick={this.handleCreateGallery}>Create gallery</button>
                                    <button className="dis-button" onClick={this.handleEditGallery} disabled={!this.state.activeGallery}>Edit</button>
                                    <button className="dis-button" onClick={this.handleDeleteGallery} disabled={!this.state.activeGallery}>Delete</button>
                                    <div className="pull-right">
                                        <input type="text" className="dis-input image-search" placeholder="Search" onChange={this.searchGalleries} value={this.state.query} />
                                    </div>
                                </nav>
                            </div>
                            <div id="image-catalog" className="content-area">
                                <div className="image-catalog-container" ref="scrollable" onScroll={this.onScroll}>
                                    <ul className="image-results">{galleries}</ul>
                                </div>
                            </div>
                            <div className="footer">
                                <nav>
                                    <div className="pull-right">
                                        <button className="dis-button" onClick={this.insertGallery}>Insert</button>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                );
        }
        return (
            <div className={'modal gallery-manager ' + visible}>{body}</div>
        );
    }
});

module.exports = GalleryManager;