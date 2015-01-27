var ARTICLE_ID = $(".article-form").data("id");
var imageCache; // cache default image results

$('.input-tags').tagList("tag");
$('.input-topics').tagList("topics");

Dropzone.options.imageForm = {
    paramName: 'img',
}

Dropzone.options.imageDropzone = {
    url: 'http://localhost:8000/api/image/',
    paramName: 'img',
    params: {
        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
    },
    addedfile: function(file) {
        file.previewElement = Dropzone.createElement(this.options.previewTemplate);
        $('.image-results').prepend(file.previewElement);
    },
    success: function(file, image){
        $(file.previewElement).addClass("catalog-image");
        $(file.previewElement).data("id", image.id);
        $(file.previewElement).data("url", image.url);
        imageCache.append(image);
    },
    clickable: '.upload-images',

}



var tabs;

$(function(){
    tabs = $('#image-manager').tabs();
    $(window).keydown(function(e){
        if(e.keyCode == 13) {
        }
    });
    $('textarea.headline').autosize();
    $('textarea.headline').keydown(function(e){
        if(e.keyCode == 13) {
            e.preventDefault();
        }
    });
});


var images = [];

//$('.modal-trigger').imageModal(function(items){
//    $.each(items, function(key, image){
//        if(images.indexOf(image) == -1){
//            var attachment = new Attachment(ARTICLE_ID, image);
//            attachment.save(function(){
//                var img = $("<li>")
//                    .css("background-image", "url('http://dispatch.dev:8888/media/"+image.thumb+"')");
//                img.data("id", attachment.id);
//                $(".images-list").append(img);
//            });
//        }
//    });
//});

$(document).on("click", "ul.images-list li", function(){
    var id = $(this).data("id");
    var element = this;
    dispatch.remove("attachment", id, function(){
        $(element).remove();
    });
});

$(document).on("click", "ul.tags li", function(){
    var tag_name = $(this).text();
    var index = tags.indexOf(tag_name);
    if(index != -1){
        tags.splice(index, 1);
    }
    $(this).remove();
});

var editor = new Editor();
editor.init(ARTICLE_ID, "textarea.content");

$(".submit-article").click(function(e){
    e.preventDefault();
    editor.prepareSave();
    $('.article-form').submit();
});

