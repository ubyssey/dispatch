var ARTICLE_ID = $(".article-form").data("id");
var imageCache; // cache default image results

$('.input-tags').tagList("tag");
$('.input-topics').tagList("topics");

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

function updateAuthorField(){
    var authors = $('ul.author-list').sortable( "toArray", { "attribute": "data-id"});
    $('.input-authors').val(authors.join(","));
}

function updateDate(date, time){
    published_at = moment(date.get() + " " + time.get('view', 'HH:i'), 'DD MMMM, YYYY HH:mm');
    $('#id_published_at').val(published_at.format('YYYY-MM-DD HH:mm:ss'));
    console.log(published_at.format('YYYY-MM-DD HH:mm:ss'));
}

var tabs;
var authorList = {};
var authorCache = {};
var authorSelected = false;

$(function(){

    $('.options.panel').tabs();

    var published_at = moment($('#id_published_at').val(), 'YYYY-MM-DD HH:mm:ss');

    console.log(published_at.format('YYYY-MM-DD'));

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

    $("select.add-author").select2({
      tags: true,
      createTag: function(data){
          return {id: data.term, text: data.term };
      },
      placeholder: "Add author",
      ajax: {
        url: "http://localhost:8000/api/person/",
        dataType: 'json',
        delay: 0,
        data: function (params) {
          return {
            q: params.term, // search term
          };
        },
        processResults: function (data, page) {
          return {
            results: data.results
          };
        },
        cache: true
      },
      minimumInputLength: 1,
      templateResult: function (person) {
          console.log(person);
          if (person.loading)
              return;
          if (person.text)
            return person.text;
          var markup = '<div>' + person.full_name + '</div>';

          return markup;
        },
        templateSelection: function (repo) {
          return repo.full_name || repo.text;
        }
    });

    $( "input.add-author" ).autocomplete({
      minLength: 3,
      appendTo: '.author-dropdown',
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

var editor = new Editor();
editor.init(ARTICLE_ID, "textarea.content");

$(".submit-article").click(function(e){
    e.preventDefault();
    editor.prepareSave();
    $('.article-form').submit();
});

