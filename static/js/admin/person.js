function cloneAccountForm(image){
    var form_idx = $('#id_imageattachment_set-TOTAL_FORMS').val();
    $('#attachments-form').append($('#attachment-template').html().replace(/__prefix__/g, form_idx));
    $('#id_imageattachment_set-'+form_idx+'-image').val(image.id);
    $('#attachment-thumb-'+form_idx).css('background-image', "url('"+image.thumb+"')");
    $('#id_imageattachment_set-TOTAL_FORMS').val(parseInt(form_idx) + 1);
}