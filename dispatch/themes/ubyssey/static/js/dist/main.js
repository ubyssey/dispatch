$('.dropdown > a').click(function(e){
    e.preventDefault();
    var dropdown = $(this).parent().find('ul');
    if(dropdown.is(':visible')){
        dropdown.hide();
    } else {
        dropdown.show();
    }
    return false;
});

$(document).on('click', function(){
    $('.dropdown ul').hide();
});