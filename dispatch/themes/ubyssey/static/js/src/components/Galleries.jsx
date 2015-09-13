var Gallery = require('./Gallery.jsx');

var Galleries = React.createClass({
    render: function(){
        var galleries = this.props.galleries.map(function(gallery, i){
            return (<Gallery key={i} title={gallery.title} trigger={gallery.trigger} selector={gallery.selector} images={gallery.list} imagesTable={gallery.table} />);
        })
        return (<div>{galleries}</div>);
    }
});

module.exports = Galleries;