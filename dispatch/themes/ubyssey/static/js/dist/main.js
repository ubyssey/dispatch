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

$('a.menu').click(function(e){
    e.preventDefault();
    if($('nav.mobile').is(':visible')){
        $('nav.mobile').hide();
    } else {
        $('nav.mobile').show();
    }
});

$('a.facebook').click(function(e){
    e.preventDefault();
    FB.ui({
      method: 'share_open_graph',
      action_type: 'og.likes',
      action_properties: JSON.stringify({
          object: $(this).data('url'),
      })
    }, function(response){});
});

$('a.twitter').click(function(e){
  e.preventDefault();
  window.open('http://twitter.com/share?url=' + $(this).data('url') + '&text=' + $(this).data('title') + '&', 'twitterwindow', 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+($(window).width()/2 - 225) +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
});