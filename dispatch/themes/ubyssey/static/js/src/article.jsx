var React = require('react');
var CommentsBar = require('./components/CommentsBar.jsx');
var Youtube = require('./modules/Youtube.js');
var Gallery = require('./components/Gallery.jsx');

var ArticleList = require('./components/ArticleList.jsx');

var articleHeader = false;

$(function(){
    if($(document).scrollTop() > 50){
        articleHeader = true;
        $('.header-site').hide();
        $('.header-article').show();
    }
});

$(document).scroll(function() {
    var top = $(document).scrollTop();
    if (top > 50 && !articleHeader){
        articleHeader = true;
        $('.header-site').hide();
        $('.header-article').fadeIn();
    } else if (top < 50 && articleHeader){
        articleHeader = false;
        $('.header-article').hide();
        $('.header-site').show();
    }
});


var Galleries = React.createClass({
    render: function(){
        var galleries = this.props.galleries.map(function(gallery, i){
            return (<Gallery key={i} trigger={gallery.trigger} selector={gallery.selector} images={gallery.list} imagesTable={gallery.table} />);
        })
        return (<div>{galleries}</div>);
    }
})

function gatherImages(gallery){
    var selector = gallery ? '#gallery-' + gallery + ' .gallery-image' : '.article-attachment';
    var trigger = gallery ? '#gallery-' + gallery + ' .gallery-thumb' : '.article-attachment';
    var images = [];
    var imagesTable = {};
    var n = 0;
    $(selector).each(function(){
        var id = $(this).data('id');
        images.push({
            'id': id,
            'url': $(this).data('url'),
            'caption': $(this).data('caption'),
            'credit': $(this).data('credit'),
        });
        imagesTable[id] = n;
        n++;
    });
    return {
        'list': images,
        'table': imagesTable,
        'selector': selector,
        'trigger': trigger
    }
}

function renderGalleries(){

    var galleries = [];

    galleries.push(gatherImages());

    $('.gallery-attachment').each(function(){
        galleries.push(gatherImages($(this).data('id')));
    });

    var gallery = React.render(
        <Galleries galleries={galleries} />,
        document.getElementById('gallery')
    );
}

renderGalleries();

var articleId = $('article').data('id');
var userId = $('article').data('user-id');

var commentsBar = React.render(
    <CommentsBar breakpoint={960} userId={userId} articleId={articleId} />,
    document.getElementById('comments-bar')
);

var articleIds = $('article').data('list');

if(articleIds === parseInt(articleIds, 10)){
    articleIds = [articleIds];
} else {
    articleIds = articleIds.split(',');
}


var articleList = React.render(
    <ArticleList firstArticle={articleId} articles={articleIds} />,
    document.getElementById('article-list')
);
