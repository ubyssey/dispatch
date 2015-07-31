var YoutubePlayer = function(element){
    var node = $(element);
    var playerReady = false;
    var userReady = false;


    var player = new YT.Player('video-' + node.data('id'), {
        height: node.width() * 0.5625, // 16:9
        width: node.width(),
        videoId: node.data('id'),
        playerVars: {
            'showinfo': 0,
            'modestbranding': 1,
        },
        events: {
            'onReady': onPlayerReady
        }
    });

    function onPlayerReady(event) {
        if(userReady){
            player.playVideo();
        } else {
            playerReady = true;
        }
    }

    $(element).find('.video-launch').click(function(){
        $(this).hide();
        $('#video-' + node.data('id')).show();
        if(playerReady){
            player.playVideo();
        } else {
            userReady = true;
        }
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
window.onYouTubeIframeAPIReady = function() {
    $('.video-attachment.youtube').each(function(){
        YoutubePlayer(this);
    });
}

