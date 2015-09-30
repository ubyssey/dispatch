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

var $articleadmin = $('#article-admin');
var pageId = $articleadmin.data('id') || false;
var sectionId = $articleadmin.data('section-id') || false;
var sectionName = $articleadmin.data('section-name') || false;
var sectionSlug = $articleadmin.data('section-slug') || false;

var pageAdmin = React.render(
    <PageAdmin imageManager={imageManager} galleryManager={galleryManager} model="page" instanceId={pageId} />,
    document.getElementById('article-admin')
);

$.fn.imageModal = function(callback){
   imageManager.addTrigger(this, callback);
}
