var soca=false;
function generateStreamID(){
	var text = "";
	var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
	for (var i = 0; i < 10; i++){
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};
var channel = generateStreamID();
var outputCounter = 0; // used to avoid doubling up on old messages if lag or whatever

var sendProperties = ["color","scale","sizeOffset","commentBottom","commentHeight","authorBackgroundColor","authorAvatarBorderColor","authorColor","commentBackgroundColor","commentColor","fontFamily","showOnlyFirstName","highlightWords"];
var alreadyPrompted = false;

function actionwtf(){ // steves personal socket server service
	if (soca){return;}
	
	if (!alreadyPrompted){
		alreadyPrompted=true;
		prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
	}
	
	soca = new WebSocket("wss://api.action.wtf:666");
	soca.onclose = function (){
		setTimeout(function(){soca=false;actionwtf(); },2000);
	};
	soca.onopen = function (){
		soca.send(JSON.stringify({"join":channel}));
	};
	
	chrome.storage.sync.set({
		streamID: channel
	});
}

setTimeout(function(){actionwtf();},100);

function pushMessage(data){
				  
	var message = {};	
	message.msg = true;
	message.contents = data;
	try {
		chrome.storage.sync.get(sendProperties, function(item){
			outputCounter+=1;
			message.id = outputCounter;
			message.settings = item;
			soca.send(JSON.stringify(message));
		});
	} catch(e){
		outputCounter+=1;
		message.id = outputCounter;
		soca.send(JSON.stringify(message));
	}
}

var showOnlyFirstName;

var highlightWords = [];

$("body").unbind("click").on("click", "yt-live-chat-text-message-renderer,yt-live-chat-paid-message-renderer,yt-live-chat-membership-item-renderer,yt-live-chat-paid-sticker-renderer", function () {

  // Don't show deleted messages
  if($(this)[0].hasAttribute("is-deleted")) {
    console.log("Not showing deleted message");
    return;
  }

  $(".hl-c-cont").remove();
  var chatname = $(this).find("#author-name").text();

  if(showOnlyFirstName) {
    chatname = chatname.replace(/ .*/,'');
  }

  var chatmessage = $(this).find("#message").html();
  var chatimg = $(this).find("#img").attr('src');
  chatimg = chatimg.replace("32", "128");
  var chatdonation = $(this).find("#purchase-amount").html();
  var chatmembership = $(this).find(".yt-live-chat-membership-item-renderer #header-subtext").html();
  var chatsticker = $(this).find(".yt-live-chat-paid-sticker-renderer #img").attr("src");

  // Donation amounts for stickers use a differnet id than regular superchats
  if(chatsticker) {
    chatdonation = $(this).find("#purchase-amount-chip").html();
  }

  var chatbadges = "";
  if($(this).find("#chat-badges .yt-live-chat-author-badge-renderer img").length > 0) {
    chatbadges = $(this).find("#chat-badges .yt-live-chat-author-badge-renderer img").parent().html();
  }

  // Mark this comment as shown
  $(this).addClass("shown-comment");

  var hasDonation = '';
  if(chatdonation) {
    hasDonation = '<div class="donation">' + chatdonation + '</div>';
  }

  var hasMembership = '';
  if(chatmembership) {
    hasMembership = '<div class="donation membership">NEW MEMBER!</div>';
    chatmessage = chatmembership;
  }

  if(chatsticker) {
    chatmessage = '<img src="'+chatsticker+'">';
  }

  var backgroundColor = "";
  var textColor = "";
  if(this.style.getPropertyValue('--yt-live-chat-paid-message-primary-color')) {
    backgroundColor = "background-color: "+this.style.getPropertyValue('--yt-live-chat-paid-message-primary-color')+";";
    textColor = "color: #111;";
  }

  // This doesn't work yet
  if(this.style.getPropertyValue('--yt-live-chat-sponsor-color')) {
    backgroundColor = "background-color: "+this.style.getPropertyValue('--yt-live-chat-sponsor-color')+";";
    textColor = "color: #111;";
  }

  var data = {};
  data.chatname = chatname;
  data.chatbadges = chatbadges;
  data.backgroundColor = backgroundColor;
  data.textColor = textColor;
  data.chatmessage = chatmessage;
  data.chatimg = chatimg;
  data.hasDonation = hasDonation;
  data.hasMembership = hasMembership;
  pushMessage(data);

});

$( "yt-live-chat-app" ).before( '<button class="btn-clear-youtube">CLEAR</button><button class="btn-getoverlay-youtube">LINK</button>' );

$("body").on("click", ".btn-clear-youtube", function () {
  pushMessage(false);
  $(".hl-c-cont").addClass("fadeout").delay(300).queue(function(){
    $(".hl-c-cont").remove().dequeue();
  });
});

$("body").on("click", ".btn-getoverlay-youtube", function () {
	alreadyPrompted=true;
	prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
});

// Restore settings

var properties = ["color","scale","streamID","sizeOffset","commentBottom","commentHeight","authorBackgroundColor","authorAvatarBorderColor","authorColor","commentBackgroundColor","commentColor","fontFamily","showOnlyFirstName","highlightWords"];

chrome.storage.sync.get(properties, function(item){
  var color = "#000";
  if(item.color) {
    color = item.color;
  }
  if (item.streamID){
    channel = item.streamID;
  } else {
	chrome.storage.sync.set({
		streamID: channel
	});
  }
  
  let root = document.documentElement;
  root.style.setProperty("--keyer-bg-color", color);

  if(item.authorBackgroundColor) {
    root.style.setProperty("--author-bg-color", item.authorBackgroundColor);
    root.style.setProperty("--author-avatar-border-color", item.authorBackgroundColor);
  }
  if(item.authorAvatarBorderColor) {
    root.style.setProperty("--author-avatar-border-color", item.authorAvatarBorderColor);
  }
  if(item.commentBackgroundColor) {
    root.style.setProperty("--comment-bg-color", item.commentBackgroundColor);
  }
  if(item.authorColor) {
    root.style.setProperty("--author-color", item.authorColor);
  }
  if(item.commentColor) {
    root.style.setProperty("--comment-color", item.commentColor);
  }
  if(item.fontFamily) {
    root.style.setProperty("--font-family", item.fontFamily);
  }
  if(item.scale) {
    root.style.setProperty("--comment-scale", item.scale);
  }
  if(item.commentBottom) {
    root.style.setProperty("--comment-area-bottom", item.commentBottom);
  }
  if(item.commentHeight) {
    root.style.setProperty("--comment-area-height", item.commentHeight);
  }
  if(item.sizeOffset) {
    root.style.setProperty("--comment-area-size-offset", item.sizeOffset);
  }
  showOnlyFirstName = item.showOnlyFirstName;
  highlightWords = item.highlightWords;
});

$("#primary-content").append('<span style="font-size: 0.7em">Aspect Ratio: <span id="aspect-ratio"></span></span>');

function displayAspectRatio() {
  var ratio = Math.round(window.innerWidth / window.innerHeight * 100) / 100;
  ratio += " (target 1.77)";
  $("#aspect-ratio").text(ratio);
}
displayAspectRatio();
window.onresize = displayAspectRatio;



function onElementInserted(containerSelector, tagName, callback) {

    var onMutationsObserved = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                for (var i = 0, len = mutation.addedNodes.length; i < len; i++) {
                    if(mutation.addedNodes[i].tagName == tagName.toUpperCase()) {
                        callback(mutation.addedNodes[i]);
                    }
                }
            }
        });
    };

    var target = document.querySelectorAll(containerSelector)[0];
    var config = { childList: true, subtree: true };
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(onMutationsObserved);
    observer.observe(target, config);

}


onElementInserted(".yt-live-chat-item-list-renderer#items", "yt-live-chat-text-message-renderer", function(element){
  console.log("New dom element inserted", element.tagName);
  // Check for highlight words
  var chattext = $(element).find("#message").text();
  var chatWords = chattext.split(" ");
  if (!highlightWords){
	  highlightWords=[];
  }
  var highlights = chatWords.filter(value => highlightWords.includes(value.toLowerCase().replace(/[^a-z0-9]/gi, '')));
  $(element).removeClass("shown-comment");
  if(highlights.length > 0) {
    $(element).addClass("highlighted-comment");
  }
});

