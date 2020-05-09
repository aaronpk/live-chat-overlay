$("body").on("click", "yt-live-chat-text-message-renderer,yt-live-chat-paid-message-renderer", function () {
	$(".hl-c-cont").remove();
	var chatname = $(this).find("#author-name").html();
	var chatmessage = $(this).find("#message").html();
	var chatimg = $(this).find("#img").attr('src');
	chatimg = chatimg.replace("32", "128");
	var chatdonation = $(this).find("#purchase-amount").html();
    $(this).addClass("show-comment");

	var hasDonation;
	if(chatdonation) {
		hasDonation = '<div class="donation">' + chatdonation + '</div>';
	}
	else {
		hasDonation = '';
	}

    var backgroundColor = "";
    var textColor = "";
  	if(this.style.getPropertyValue('--yt-live-chat-paid-message-primary-color')) {
  		backgroundColor = "background-color: "+this.style.getPropertyValue('--yt-live-chat-paid-message-primary-color')+";";
  		textColor = "color: #111;";
  	}

	$( "highlight-chat" ).append('<div class="hl-c-cont fadeout"><div class="hl-name">' + chatname + '</div>' + '<div class="hl-message" style="'+backgroundColor+' '+textColor+'">' + chatmessage + '</div><div class="hl-img"><img src="' + chatimg + '"></div>'+hasDonation+'</div>')
	.delay(10).queue(function(next){	
		$( ".hl-c-cont" ).removeClass("fadeout");
		next();
	});	

});

$("body").on("click", ".btn-clear", function () {
	$(".hl-c-cont").addClass("fadeout").delay(300).queue(function(){
	    $(".hl-c-cont").remove().dequeue();
	});
});

$( "yt-live-chat-app" ).before( '<highlight-chat></highlight-chat><button class="btn-clear">CLEAR</button>' );
