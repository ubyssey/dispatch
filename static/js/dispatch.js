function Image(id, url, thumb) {
    this.id;
    this.url;
    this.thumb;
    if (typeof id != "undefined")
        this.id = id;
    if (typeof url != "undefined")
        this.url = url;
    if (typeof thumb != "undefined")
        this.thumb = thumb;
    this.caption;

    this.setUrl = function(value){
        this.url = value;
    }

    this.setCaption = function(value){
        this.caption = value;
    }

    this.setAuthor = function(id){

    }
}

function Attachment(article_id, image) {
    this.id;
    if(article_id){
        this.article_id = article_id;
    } else {
        this.article_id = false;
    }
    this.image_id = image.id;
    this.caption = image.caption;
    var self = this;
}

Attachment.prototype.save = function(callback){
    var data = {
        'image': this.image_id,
        'caption': this.caption,
    };
    if (this.article_id)
        data.article = this.article_id;
    dispatch.add("attachment", data, callback);
}

function ImageCache(images) {
    var self = this;
    self.cache = {};

    $.each(images, function(key, image){
        self.cache[image.id] = new Image(image.id, image.url, image.thumb);
    });

    this.append = function(image){
        self.cache[image.id] = new Image(image.id, image.url, image.thumb);
    }
}

ImageCache.prototype.get = function(id) {
    return this.cache[id];
}

ImageCache.prototype.getAll = function() {
    return this.cache;
}

$.fn.tagList = function(model) {
    self = this;

    var inputField = this;

    var tags = [];

    var tagString = $(self).val();

    if(tagString)
        tags = tags.concat(tagString.split(","));

    var className = "tagList-" + model;
    var list = $("<ul>").addClass("tagList").addClass(className+"-list");
    var addTag = $("<div>").addClass(className+"-add");
    var anchor = $("<a>").text("Add "+model).attr("href", "#");
    addTag.append(anchor);

    var pushTag = function(tag_name){
        var tag = $("<li>");
        tag.append(tag_name);
        tag.data("tag", tag_name);
        list.append(tag);
    }

    $.each(tags, function(key, tag){
         pushTag(tag);
    });

    var input = $("<input>").addClass("add-box").addClass(className+"-input");

    addTag.append(input);

    this.after(
        $("<div>").addClass(className).append(list).append(addTag)
    );

    anchor.click(function(e){
        e.preventDefault();
        $(this).hide();
        input.show();
        input.focus();
    });

    input.focusout(function() {
        $(this).hide();
        anchor.show();
    });

    input.bind("enterKey", function(e){
        var tag_name = $.trim($(this).val());
        if(tags.indexOf(tag_name) == -1 && tag_name != ""){
            tags.push(tag_name);
            $(this).val(tags.join(","));
            $(inputField).val(tags.join(","));
            pushTag(tag_name);
        }
        $(this).val("");
    });

    input.keydown(function(e){
        if(e.keyCode == 13)
        {
            e.preventDefault();
            $(this).trigger("enterKey");
            return false;
        }
    });
}