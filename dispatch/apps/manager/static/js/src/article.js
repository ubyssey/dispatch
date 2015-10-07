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

var $articleadmin = $('#article-admin');
if($articleadmin.length){
    var articleId = $articleadmin.data('id') || false;
    var sectionId = $articleadmin.data('section-id') || false;
    var sectionName = $articleadmin.data('section-name') || false;
    var sectionSlug = $articleadmin.data('section-slug') || false;

    var articleAdmin = React.render(
        <ArticleAdmin imageManager={imageManager} galleryManager={galleryManager} model="article" instanceId={articleId} sectionId={sectionId} sectionName={sectionName} sectionSlug={sectionSlug} />,
        document.getElementById('article-admin')
    );
}

if($('#page-admin').length){
    var pageId = $('#page-admin').data('id') || false;

    var pageAdmin = React.render(
        <PageAdmin imageManager={imageManager} galleryManager={galleryManager} model="page" instanceId={pageId} />,
        document.getElementById('page-admin')
    );
}


