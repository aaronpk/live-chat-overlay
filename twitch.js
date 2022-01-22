var soca=false;
function generateStreamID(){
	var text = "";
	var possible = "ABCEFGHJKLMNPQRSTUVWXYZabcefghijkmnpqrstuvwxyz23456789";
	for (var i = 0; i < 11; i++){
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

	soca = new WebSocket("wss://api.overlay.ninja");
	soca.onclose = function (){
		setTimeout(function(){soca=false;actionwtf(); },2000);
	};
	soca.onopen = function (){
		soca.send(JSON.stringify({"join":channel}));
	};
	
	soca.addEventListener('message', function (event) {
		if (event.data){
			var data = JSON.parse(event.data);
			if ("url" in data){
				if ("twitch" in data){
					if (document.getElementById("img_"+data["twitch"])){
						document.getElementById("img_"+data["twitch"]).src = data['url'];
					}
				}
			}
		}
	});

	chrome.storage.sync.set({
		streamID: channel
	});
	
	chrome.runtime.lastError;
}

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


$("body").unbind("click").on("click", ".chat-line__message", function () { // twitch

  var chatdonation = false;
  var chatmembership = false;
  var chatsticker = false;
  
  $(".hl-c-cont").remove();
  var chatname = $(this).find(".chat-author__display-name").text();

  if (showOnlyFirstName) {
    chatname = chatname.replace(/ .*/,'');
  }
  
  $(this).find('.bttv-tooltip').html(""); // BTT support
  
  
  var chatmessage = $(this).find('*[data-test-selector="chat-line-message-body"').html();
  if (!chatmessage){
	  chatmessage = $(this).find('span.message').html(); // FFZ support
  }
  
  if (!chatmessage){
	  chatdonation = $(this).find('.chat-line__message--cheer-amount').html(); // FFZ support
	  if (chatdonation){
		 //$(this).find('.chat-line__message--cheer-amount').html("");
		 // $(this).find("span[data-test-selector='chat-message-separator']").html("");
		 //$(this).find(".chat-line__message-container").find('span[data-test-selector="chat-message-separator"]').nextAll().html();
		 chatmessage = "";
		 chatdonation = 0;
		 $(this).find(".chat-line__message-container").find('span[data-test-selector="chat-message-separator"]').nextAll().each(function(index){
			if ($(this).find('.chat-line__message--cheer-amount').html()){
				chatdonation += parseInt($(this).find('.chat-line__message--cheer-amount').html());
			}
			chatmessage += $(this).html();
		});
		if (chatdonation==1){
			chatdonation += " bit";
		} else if (chatdonation>1){
			chatdonation += " bits";
		}
		
	  }
  }
  
  if (!chatmessage){
	   console.log($(this));
	   console.log("No message found");
	   return;
  }
  var chatimg = 'http://chat.overlay.ninja/twitch.png';
  
  this.style.backgroundColor = "#666";

  var chatbadges = "";
  if($(this).find("#chat-badges .yt-live-chat-author-badge-renderer img").length > 0) {
    chatbadges = $(this).find("#chat-badges .yt-live-chat-author-badge-renderer img").parent().html();
  }

  // Mark this comment as shown
  $(this).addClass("shown-comment");

  var hasDonation = '';
  if(chatdonation) {
    hasDonation = '<div class="cheer">' + chatdonation + '</div>';
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
  data.type = "twitch";
  
  fetch("https://api.action.wtf:667/username/"+data.chatname).then(response => {
		response.text().then(function (text) {
			if (text.startsWith("https://")){
				data.chatimg = text;
			} 
			pushMessage(data);
		}).catch(function(){
			pushMessage(data);
		});
	}).catch(error => {
		pushMessage(data);
	});
});

$("body").on("click", ".btn-clear-twitch", function () {
  pushMessage(false);
  $(".hl-c-cont").addClass("fadeout").delay(300).queue(function(){
    $(".hl-c-cont").remove().dequeue();
  });
});

function addButtons(){
	if (document.getElementById("pushButtonOverlay")){return;}
	if (document.querySelector(".chat-input__buttons-container")){
		document.querySelector(".chat-input__buttons-container").innerHTML += '<button  id="pushButtonOverlay" class="btn-clear-twitch">CLEAR</button><button class="btn-getoverlay-twitch">LINK</button>';
	} else if (document.querySelector(".chat-room__content")){
		document.querySelector(".chat-room__content").lastChild.innerHTML += '<button  id="pushButtonOverlay" class="btn-clear-twitch">CLEAR</button><button class="btn-getoverlay-twitch">LINK</button>';
	} 
}

setTimeout(function(){addButtons();},1000);

setTimeout(function(){addButtons();},10000);

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
	
	chrome.runtime.lastError;
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


$("body").on("click", ".btn-getoverlay-twitch", function () {
    alreadyPrompted=true;
    prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
});


setTimeout(function(){actionwtf();},500);

$("#primary-content").append('<span style="font-size: 0.7em">Aspect Ratio: <span id="aspect-ratio"></span></span>');

function displayAspectRatio() {
  var ratio = Math.round(window.innerWidth / window.innerHeight * 100) / 100;
  ratio += " (target 1.77)";
  $("#aspect-ratio").text(ratio);
}
displayAspectRatio();
window.onresize = displayAspectRatio;


function onElementInsertedTwitch(containerSelector, className, callback) {
	var onMutationsObserved = function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.addedNodes.length) {
				for (var i = 0, len = mutation.addedNodes.length; i < len; i++) {
					if(mutation.addedNodes[i].className == className) {
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

onElementInsertedTwitch(".chat-scrollable-area__message-container", "chat-line__message", function(element){
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
	
