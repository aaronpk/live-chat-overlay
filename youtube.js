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

    var backgroundColor = "black";
    var borderColor = "#333";
    var textColor = "white";
  	if(this.style.getPropertyValue('--yt-live-chat-paid-message-secondary-color')) {
  		backgroundColor = this.style.getPropertyValue('--yt-live-chat-paid-message-primary-color');
  		borderColor = this.style.getPropertyValue('--yt-live-chat-paid-message-secondary-color');
  		textColor = "black";
  	}

	$( "highlight-chat" ).append('<div class="hl-c-cont fadeout"><div class="hl-name">' + chatname + '</div>' + '<div class="hl-message" style="background-color: '+backgroundColor+'; color: '+textColor+';">' + chatmessage + '</div><div class="hl-img"><img src="' + chatimg + '" style="border-color:'+borderColor+'"></div>'+hasDonation+'</div>')
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
