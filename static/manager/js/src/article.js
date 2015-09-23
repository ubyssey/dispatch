var React = require('react');
var ImageManager = require('./components/modals/ImageManager.jsx');
var GalleryManager = require('./components/modals/GalleryManager.jsx');

var ArticleAdmin = require('./components/ArticleAdmin.jsx');
var PageAdmin = require('./components/PageAdmin.jsx');

var imageManager = React.render(
    <ImageManager />,
    document.getElementById('image-manager')
);

var galleryManager = React.render(
    <GalleryManager imageManager={imageManager} />,
    document.getElementById('gallery-manager')
);

$.fn.imageModal = function(callback){
   imageManager.addTrigger(this, callback);
}

if($('#article-admin').length){
    var articleId = $('#article-admin').data('id');
    articleId = articleId ? articleId : false;
    var sectionId = $('#article-admin').data('section-id');
    sectionId = sectionId ? sectionId : false;
    var sectionName = $('#article-admin').data('section-name');
    sectionName = sectionName ? sectionName : false;
    var sectionSlug = $('#article-admin').data('section-slug');
    sectionSlug = sectionSlug ? sectionSlug : false;

    var articleAdmin = React.render(
        <ArticleAdmin imageManager={imageManager} galleryManager={galleryManager} model="article" instanceId={articleId} sectionId={sectionId} sectionName={sectionName} sectionSlug={sectionSlug} />,
        document.getElementById('article-admin')
    );
}

if($('#page-admin').length){
    var pageId = $('#page-admin').data('id');
    pageId = pageId ? pageId : false;

    var pageAdmin = React.render(
        <PageAdmin imageManager={imageManager} galleryManager={galleryManager} model="page" instanceId={pageId} />,
        document.getElementById('page-admin')
    );
}


