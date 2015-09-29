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
		$('#search-form').hide();
});

$('a.menu').click(function(e){
    e.preventDefault();
    if($('nav.mobile').is(':visible')){
        $('nav.mobile').hide();
        $(this).removeClass('active');
    } else {
        if($('#search-form').is(':visible')){
            $('#search-form').hide();
            $('a.search').removeClass('active');
        }
        $('nav.mobile').show();
        $(this).addClass('active');
    }
});

$('a.search').click(function(e){
    e.preventDefault();
    if($('#search-form').is(':visible')){
        $('#search-form').hide();
        $(this).removeClass('active');
    } else {
        if($('nav.mobile').is(':visible')){
            $('nav.mobile').hide();
            $('a.menu').removeClass('active');
        }
        $('#search-form').show();
        $(this).addClass('active');
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