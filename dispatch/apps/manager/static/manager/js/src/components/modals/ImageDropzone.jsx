var React = require('react');
var Dropzone = require('dropzone');
var Image = require('./Image.jsx');

var ImageDropzone = React.createClass({
  componentDidMount: function() {
    var options = {};
    for (var opt in Dropzone.prototype.defaultOptions) {
      var prop = this.props[opt];
      if (prop) {
        options[opt] = prop;
        continue;
      }
      options[opt] = Dropzone.prototype.defaultOptions[opt];
    }
    options.addedfile = function(file){};
    options.success = function(file, image){
        $(file.previewElement).addClass("catalog-image");
        $(file.previewElement).data("id", image.id);
        $(file.previewElement).data("url", image.url);
        this.props.onUpload(file, image);
    }.bind(this);

    options.params = {
        'csrfmiddlewaretoken': dispatch.getCSRFToken(),
    }

    this.dropzone = new Dropzone(this.getDOMNode(), options);
    this.dropzone.on("uploadprogress", this.props.updateProgress);
    this.dropzone.on("thumbnail", this.props.addFile)
  },
  componentWillUnmount: function() {
    this.dropzone.destroy();
    this.dropzone = null;
  },
  render: function() {
    var children = this.props.children;
    var imageNodes = this.props.images.map(function(image, i) {
      return (
        <Image key={i} id={image.id} thumb={image.thumb} url={image.url} progress={image.progress} onClickHandler={this.props.onClickHandler} selected={this.props.selected.indexOf(image.id) !== -1} />
      );
    }.bind(this));
    return (
        <ul id="image-dropzone" ref="imageContents" className="image-results">
        {imageNodes}
        </ul>
    );
  }
});

module.exports = ImageDropzone;
