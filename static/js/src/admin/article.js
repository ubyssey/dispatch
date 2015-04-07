var Editor = require('./editor.js');
var ImageManager = require('./components/ImageManager.jsx');

var imageManager = React.render(
    <ImageManager />,
    document.getElementById('modals')
);

$.fn.imageModal = function(callback){
   imageManager.addTrigger(this, callback);
}

var ARTICLE_ID = $(".article-form").data("id");
var ARTICLE_SAVEATTEMPT = $(".article-form").data("saveattempt");
var ARTICLE_SAVED = $(".article-form").data("saved");
var ARTICLE_SAVEID = $(".article-form").data("saveid");

$('.input-tags').tagList("tag");
$('.input-topics').tagList("topics");

var confirmOnPageExit = function (e)
{
    // If we haven't been passed the event get the window.event
    e = e || window.event;

    var message = 'You have made changes to the article.';

    // For IE6-8 and Firefox prior to version 4
    if (e)
    {
        e.returnValue = message;
    }

    // For Chrome, Safari, IE8+ and Opera 12+
    return message;
};

function setChanged(){
    window.onbeforeunload = confirmOnPageExit;
};

$(".article-form").change(function(){
    setChanged();
});

function addAuthor(author){
    if (typeof author === 'object'){
        appendAuthor(author);
    } else {
        dispatch.add("person", {
            'full_name': author,
        }, function(data){
            appendAuthor(data);
        });
    }
}

function appendAuthor(author){
    if(!authorList.hasOwnProperty(author.id)) {
        authorList[author.id] = author.full_name;
        $('ul.author-list').append(
            $('<li>')
                .attr("data-id", author.id)
                .append(
                    $('<span>').text(author.full_name)
                        .append(
                             $('<a href="#" class="delete-author"><i class="fa fa-close"></i></a>')
                        )
                )
        );
        updateAuthorField();
    }
}

$('input.add-author').keydown(function(e){
    if(e.keyCode == 13 && !authorSelected)
    {
        e.preventDefault();
        addAuthor($(this).val());
        $(this).val("");
    }
});

function updateAuthorField(){
    var authors = $('ul.author-list').sortable( "toArray", { "attribute": "data-id"});
    $('.input-authors').val(authors.join(","));
}

function updateDate(date, time){
    published_at = moment(date.get() + " " + time.get('view', 'HH:i'), 'DD MMMM, YYYY HH:mm');
    $('#id_published_at').val(published_at.format('YYYY-MM-DD HH:mm:ss'));
}

var tabs;
var authorList = {};
var authorCache = {};
var authorSelected = false;

$(function(){

    $('.options.panel').tabs();

    var published_at = moment($('#id_published_at').val(), 'YYYY-MM-DD HH:mm:ss');

    var pickdate = $('*[name=published_at_date]').data("value", published_at.format('YYYY-MM-DD')).pickadate({
        formatSubmit: 'yyyy-mm-dd',
    }).pickadate('picker');

    var picktime = $('*[name=published_at_time]').data("value", published_at.format('HH:mm')).pickatime().pickatime('picker');

    updateDate(pickdate, picktime);
    pickdate.on('set', function(){ updateDate(pickdate, picktime);});
    picktime.on('set', function(){ updateDate(pickdate, picktime);});

    $('.edit-authors').click(function(e){
        e.preventDefault();
        if($('.manage-authors').is(':visible')){
            $('.manage-authors').slideUp();
        } else {
            $('.manage-authors').slideDown();
        }
    });

    $(document).on("click", '.delete-author', function(e){
        e.preventDefault();
        var id = $(this).parent().parent().data("id");
        $(this).parent().parent().remove();
        updateAuthorField();
        delete authorList[id];
    });

    $('ul.author-list li').each(function(key, item){
        var id = $(item).data("id");
        var name = $(item).text();
        authorList[id] = name;
    });

    $( "ul.author-list" ).sortable({
      placeholder: "ui-state-highlight",
      update: function(event, ui){
          updateAuthorField();
      }
    });

    $( ".manage-authors input.add-author" ).autocomplete({
      minLength: 3,
      appendTo: '.manage-authors .author-dropdown',
      focus: function (event, ui) {
        event.preventDefault();
        authorSelected = true;
        $(this).val(ui.item.full_name);
      },
      select: function( event, ui ) {
        addAuthor({id: ui.item.id, full_name: ui.item.full_name});
      },
      source: function( request, response ) {
        var term = request.term;
        if ( term in authorCache ) {
          response( authorCache[ term ] );
          return;
        }

        $.getJSON( "http://localhost:8000/api/person/", {q: request.term}, function( data, status, xhr ) {
          authorCache[ term ] = data.results;
          response( data.results );
        });
      }
    }).autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a>" + item.id + "<br>" + item.full_name + "</a>" )
        .appendTo( ul );
    };

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

var editor = Editor(ARTICLE_ID, "textarea.content", ARTICLE_SAVEATTEMPT, ARTICLE_SAVED, ARTICLE_SAVEID);
editor.init();
editor.setImageManager(imageManager);

$(".submit-article").click(function(e){
    e.preventDefault();
    editor.prepareSave();
    window.onbeforeunload = null;
    $('.article-form').submit();
});

$(".publish-article").click(function(e){
    e.preventDefault();
    editor.prepareSave();
    window.onbeforeunload = null;
    $('#id_is_published').val('True');
    $('.article-form').submit();
});

$(".unpublish-article").click(function(e){
    e.preventDefault();
    editor.prepareSave();
    window.onbeforeunload = null;
    $('#id_is_published').val('False');
    $('.article-form').submit();
});

$('.set-featured-image').imageModal(function(items){
    var image = items[0];
    //var image = ImageStore.getImage(id);
    $('#id_image').val(image.id);
    $('img.featured-image').attr("src", image.url);
});

window.editor = editor;