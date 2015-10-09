var sizes = {
    'box': [300, 250],
    'leaderboard': [728, 90],
    'mobile-leaderboard': [300, 50]
};

var adslots = [];

function initAds(){
    // Infinite scroll requires SRA
    googletag.pubads().enableSingleRequest();

    // Disable initial load, we will use refresh() to fetch ads.
    // Calling this function means that display() calls just
    // register the slot as ready, but do not fetch ads for it.
    googletag.pubads().disableInitialLoad();

    // Enable services
    googletag.enableServices();
};

function collectAds(element){
    var dfpslots = $(element).find(".adslot").filter(":visible");
    $(dfpslots).each(function(){
        var slotName = $(this).attr('id');
        adslots.push([
            slotName,
            googletag.defineSlot('/61222807/'+$(this).data('dfp'), sizes[$(this).data('size')], slotName)
                .addService(googletag.pubads())
            ]);
    });
}

function refreshAds(){
    $.each(adslots, function(i, slot){
        googletag.display(slot[0]);
        googletag.pubads().refresh([slot[1]]);
    });
};

$(document).ready(function(){
    googletag.cmd.push(function() { initAds() });
    googletag.cmd.push(function() { collectAds(document); });
    googletag.cmd.push(function() { refreshAds() });
});
