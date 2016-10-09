require('babel/polyfill');

var React = require('react');
var Textarea = require('react-textarea-autosize');
var ImageStore = require('../ImageStore.js');

var EditorGallery = React.createClass({
    getInitialState: function(){
        return {
            gallery: this.props.data,
        };
    },
    updateGallery: function(gallery){
        this.setState({ gallery: gallery });
    },
    removeGallery: function(){
        this.props.remove();
    },
    openGalleryManager: function(){
        this.props.galleryManager.openWithCallback(this.updateGallery, { multiple: true });
    },
    getJSON: function(){
        return {
            type: 'gallery',
            data: {
                id: this.state.gallery.id,
                title: this.state.gallery.title
            }
        }
    },
    render: function(){
        return (
            <div className="gallery basic">
                <div className="header">
                    <div className="pull-left">
                        <h4>{'Gallery: ' + this.state.gallery.title}</h4>
                    </div>
                    <div className="pull-right">
                        <button onClick={this.openGalleryManager}><i className="fa fa-pencil"></i> Change</button>
                        <button onClick={this.removeGallery}><i className="fa fa-trash-o"></i> Remove</button>
                    </div>
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