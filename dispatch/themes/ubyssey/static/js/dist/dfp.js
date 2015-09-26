var sizes = {
    'box': [300, 250],
    'leaderboard': [728, 90],
    'mobile-leaderboard': [300, 50]
};

$(document).ready(function(){
	var dfpslots=$("body").find(".adslot").filter(":visible"),
	i=0,
	slot = new Array();

	if (dfpslots.length) {
		googletag.cmd.push(function() {
			$(dfpslots).each(function(){
				slot[i] = googletag.defineSlot('/61222807/'+$(this).data('dfp'), sizes[$(this).data('size')], $(this).attr('id')).addService(googletag.pubads());
				i++
			});

			//googletag.pubads().enableSingleRequest(); // Breaks channel reporting
			googletag.enableServices();

			$(dfpslots).each(function(){
                console.log($(this).attr('id'));
				googletag.display($(this).attr('id'));
			});
		});
	}
});
