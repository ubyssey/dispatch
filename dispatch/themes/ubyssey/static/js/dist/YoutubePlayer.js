var YoutubePlayer = function(element){
    var node = $(element);

    var player = new YT.Player('video-' + node.data('id'), {
      height: node.width() * 0.5625, // 16:9
      width: node.width(),
      videoId: node.data('id'),
        playerVars: {
            'showinfo': 0,
            'modestbranding': 1
        },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        //event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    function onPlayerStateChange(event) {

    }

    $(element).find('.video-launch').click(function(){
        $(this).hide();
        $('#video-' + node.data('id')).show();
        player.playVideo();
    })

    function stopVideo() {
        player.stopVideo();
    }
}

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
    $('.video-attachment.youtube').each(function(){
        YoutubePlayer(this);
    });
}