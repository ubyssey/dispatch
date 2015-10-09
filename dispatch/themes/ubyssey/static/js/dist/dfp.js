var sizes = {
    'box': [300, 250],
    'leaderboard': [728, 90],
    'mobile-leaderboard': [300, 50]
};

function loadAdvertisements(){
    var dfpslots=$(document).find(".adslot").filter(":visible"),
    i=0,
    slot = new Array();


		var adNum = 1;
    if (dfpslots.length) {
        googletag.cmd.push(function() {
            $(dfpslots).each(function(){
                console.log($(this).attr('id'));
								$(this).attr('id', "div-gpt-ad-1443288719995-"+String(adNum));
								console.log($(this).attr('id'));
                slot[i] = googletag.defineSlot('/61222807/'+$(this).data('dfp'), sizes[$(this).data('size')], $(this).attr('id')).addService(googletag.pubads());
                adNum++
            });

            //googletag.pubads().enableSingleRequest(); // Breaks channel reporting
            googletag.enableServices();

            $(dfpslots).each(function(){
                console.log($(this).attr('id'));
                googletag.display($(this).attr('id'));
            });
        });
    }
};

function refreshAdvertisements(){
    loadAdvertisements();
};

$(document).ready(function(){
    loadAdvertisements();
});
