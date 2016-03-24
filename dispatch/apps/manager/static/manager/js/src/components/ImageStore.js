var _ = require('lodash');

var ImageStore = function(){
    return {
        images: [],
        dump: function(images){
            this.images = images;
        },
        append: function(images){
            this.images = this.images.concat(images);
        },
        addTemp: function(name, thumb){
            var tempImage = {
                tempName: name,
                thumb: thumb,
            }
            this.images.unshift(tempImage);
        },
        updateProgress: function(name, progress){
            var i = _.findIndex(this.images, {tempName: name})
            this.images[i].progress = progress;
        },
        updateImage: function(id, callback){
            dispatch.find('image', id, function(data){
                var i = _.findIndex(this.images, {id: id});
                this.images[i] = data;
                callback();
            }.bind(this))
        },
        updateImageWithData: function(data){
            var i = _.findIndex(this.images, {id: data.id});
            this.images[i] = data;
        },
        updateAttachment: function(attachment_id, data){
            var i = _.findIndex(this.images, {attachment_id: attachment_id});
            this.images[i] = data;
        },
        replaceTemp: function(name, image){
            var i = _.findIndex(this.images, {tempName: name});
            this.images[i] = image;
        },
        getImage: function(id){
            var i = _.findIndex(this.images, {id: id});
            return this.images[i];
        },
        getImages: function(ids){
            var images = [];
            _.forEach(ids, function(id, index){
                images.push(this.getImage(id));
            }.bind(this));
            return images;
        },
        removeImage: function(id){
            _.remove(this.images, function(n) {
                return n.id == id;
            });
        },
        removeAttachment: function(attachment_id) {
            _.remove(this.images, function(n) {
                return n.attachment_id == attachment_id;
            });
        },
        all: function(){
            return this.images;
        }
    }
}

module.exports = ImageStore;
