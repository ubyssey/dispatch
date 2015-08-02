var React = require('react');
var Youtube = require('./modules/Youtube.js');

var ArticleList = require('./components/ArticleList.jsx');

window.articleHeader = false;

$(function(){
    if($(document).scrollTop() > 50){
        window.articleHeader = true;
        $('.header-site').hide();
        $('.header-article').show();
    }
});


var articleId = $('article').data('id');
var articleHeadline = $('article').data('headline');
var articleURL = $('article').data('url');

var userId = $('article').data('user-id');

var articleIds = $('article').data('list');
var listName = $('article').data('list-name');

if(articleIds === parseInt(articleIds, 10)){
    articleIds = [articleIds];
} else {
    articleIds = articleIds.split(',');
}

var firstArticle = {
    id: articleId,
    long_headline: articleHeadline,
    url: articleURL
};

var articleList = React.render(
    <ArticleList name={listName} firstArticle={firstArticle} articles={articleIds} userId={userId} />,
    document.getElementById('article-list')
);
