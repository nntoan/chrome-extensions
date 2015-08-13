(function($){
	$(function(){
		var quality = $(".list-icon :first-child");
		chrome.runtime.sendMessage(null, {type: "QUALITY", maxQuality: quality.text()});
	})
})(jQuery);