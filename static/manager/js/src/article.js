var React = require('react');
var ImageManager = require('./components/ImageManager.jsx');
var ArticleSidebar = require('./components/ArticleSidebar.jsx');
var ArticleAdmin = require('./components/ArticleAdmin.jsx');

var imageManager = React.render(
    <ImageManager />,
    document.getElementById('modals')
);

var articleId = $('#article-admin').data('id');
articleId = articleId ? articleId : false;
var sectionId = $('#article-admin').data('section-id');
sectionId = sectionId ? sectionId : false;
var sectionName = $('#article-admin').data('section-name');
sectionName = sectionName ? sectionName : false;
var sectionSlug = $('#article-admin').data('section-slug');
sectionSlug = sectionSlug ? sectionSlug : false;

var articleAdmin = React.render(
    <ArticleAdmin imageManager={imageManager} articleId={articleId} sectionId={sectionId} sectionName={sectionName} sectionSlug={sectionSlug}/>,
    document.getElementById('article-admin')
);

$.fn.imageModal = function(callback){
   imageManager.addTrigger(this, callback);
}