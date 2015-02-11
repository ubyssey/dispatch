dispatch = new Dispatch();

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

// jQuery plugins


function ImageManager(){
    var active;
    var selected = [];
    var target = ".image-manager";
    var initialized = false;
    var callbacks = {};
    var curTrigger = false;

    var addTriggerEvent = function(trigger){
        $(trigger).click(function(e){
            curTrigger = trigger;
            e.preventDefault();
            if(!initialized){
                dispatch.search("image", {'ordering': '-created_at'}, function(data){
                    imageCache = new ImageCache(data.results);
                    updateLibrary(imageCache);
                    initialized = true;
                });
            } else {
                clearSelected();
                updateLibrary(imageCache);
            }
            $(target).css("display", "table");
        });
    }

    this.addTrigger = function(trigger, callback){
        callbacks[trigger.selector] = callback;
        addTriggerEvent(trigger);
    }

    var clearSelected = function(){
        selected = [];
    }

    var clearSearchbar = function(){
        $('.image-search').val("");
    }

    var clearLibrary = function(){
        $(".image-results").html("");
    }

    var updateLibrary = function(cache){
        clearSearchbar();
        clearLibrary();
        $.each(cache.getAll(), function(key, image){
           appendImage(image);
        });
    }

    $('.image-search').keydown(function(e){
        if(e.keyCode == 13) {
            $(".image-results").html("");
            dispatch.search("image", {q: $(this).val()}, function(data){
                $.each(data.results, function(key, image){
                   appendImage(image);
                });
            });
        }
    });

    var appendImage = function(image){
        var img = $("<li>");
        img.addClass("catalog-image");
        img.css("background-image", "url('http://dispatch.dev:8888/media/"+image.thumb+"')");
        img.data("id", image.id);
        img.data("url", image.url);
        $(".image-results").prepend(img);
    }

    $('.image-form').on("submit", function(e){
        e.stopPropagation();
        e.preventDefault()

        data = new FormData(this);

        dispatch.upload(data, function(image){
            imageCache.append(image);
            appendImage(image);
            $('.image-form').find("input").val("");
            tabs.tabs({'active': 1});
        });
    });

    var updateMeta = function(){
        var image = imageCache.get(active);
        $('.image-meta-preview').attr("src", "http://dispatch.dev:8888/media/"+image.url).show();
        $('.image-caption').val(image.caption);
    }

    $(document).on("click", ".image-results .catalog-image", function(){
        active = $(this).data("id");
        $(".image-results li").removeClass("selected");
        $(this).addClass("selected");
        updateMeta();
    });

    $(".image-caption").change(function(){
        imageCache.get(active).setCaption($(this).val());
    });

    $(".image-author").change(function(){
        imageCache.get(active).setAuthor($(this.val())).update();
    });

    $(target).find(".body").mouseup(function (e)
    {
        var container = $(this).find(".content");
        if (!container.is(e.target) && container.has(e.target).length === 0)
        {
            $(target).hide();
        }
    });

    $("button.insert-image").click(function(){
        if (active)
            selected.push(imageCache.get(active));
        $(target).hide();
        callbacks[curTrigger.selector](selected);
    });
}

var IM = new ImageManager();

$.fn.imageModal = function(callback){
   IM.addTrigger(this, callback);
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