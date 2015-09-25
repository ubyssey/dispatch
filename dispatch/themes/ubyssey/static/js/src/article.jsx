var Youtube = require('./modules/Youtube.js');
var ArticleList = require('./components/ArticleList.jsx');
var Search = require('./components/Search.jsx');

window.articleHeader = false;

if($('main.article').length){

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
        headline: articleHeadline,
        url: articleURL
    };

    var articleList = React.render(
        <ArticleList breakpoint={960} name={listName} firstArticle={firstArticle} articles={articleIds} userId={userId} />,
        document.getElementById('article-list')
    );
}

React.render(
    <Search />,
    document.getElementById('search-form')
);
