var React = require('react');
var ImageManager = require('./components/modals/ImageManager.jsx');
var GalleryManager = require('./components/modals/GalleryManager.jsx');

var PageAdmin = require('./components/PageAdmin.jsx');

var imageManager = React.render(
    <ImageManager />,
    document.getElementById('image-manager')
);

var galleryManager = React.render(
    <GalleryManager imageManager={imageManager} />,
    document.getElementById('gallery-manager')
);

var pageId = $('#article-admin').data('id');
pageId = pageId ? pageId : false;
var sectionId = $('#article-admin').data('section-id');
sectionId = sectionId ? sectionId : false;
var sectionName = $('#article-admin').data('section-name');
sectionName = sectionName ? sectionName : false;
var sectionSlug = $('#article-admin').data('section-slug');
sectionSlug = sectionSlug ? sectionSlug : false;

var pageAdmin = React.render(
    <PageAdmin imageManager={imageManager} galleryManager={galleryManager} model="page" instanceId={pageId} />,
    document.getElementById('article-admin')
);

$.fn.imageModal = function(callback){
   imageManager.addTrigger(this, callback);
}