var React = require('react');
var ManyModelDropdown = require('../fields/ManyModelDropdown.jsx');
var ItemStore = require('../stores/ItemStore.js');

var GalleryImageMeta = React.createClass({
    handleChangeCaption: function(event){
        var image = this.props.image;
        image.caption = event.target.value;
        this.props.updateHandler(this.props.image.attachment_id, image);
    },
    handleDelete: function(){
        this.props.deleteHandler(this.props.image.attachment_id);
    },
    render: function(){
        return (
            <div className="image-meta">
                <img className="image-meta-preview" src={ this.props.image.url } />
                <h3>{this.props.image.filename}</h3>
                <div className="field full">
                    <label>Caption</label>
                    <input type="text" className="full" onChange={ this.handleChangeCaption } value={ this.props.image.caption }/>
                </div>
                <div className="field full">
                    <div className="pull-right">
                        <button onClick={this.handleDelete} className="dis-button">Remove from gallery</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = GalleryImageMeta;