(function() {
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

function actionwtf(){ // steves personal socket server service
	if (soca){return;}

	soca = new WebSocket("wss://api.action.wtf:666");
	soca.onclose = function (){
		setTimeout(function(){soca=false;actionwtf(); },2000);
	};
	soca.onopen = function (){
		soca.send(JSON.stringify({"join":channel}));
	};
	
	/* soca.addEventListener('message', function (event) {
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
	}); */
	
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

function initMessage(ele){
	try{
		ele.addEventListener('click', prepMessage);
		ele.style.cursor = "pointer";
	} catch(e){}
}

var showOnlyFirstName;
var highlightWords = [];

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

function prepMessage(ele){
  if (ele == window){return;}
  if (this){
	  ele = this;
  }
  
  try {
	document.querySelector(".hl-c-cont").parentNode.removeChild(document.querySelector(".hl-c-cont"));
  } catch(e){}
  
  if (ele.querySelector("h3")){
	 var base = ele.querySelector("h3");
  } else {
	 var base = ele.querySelector("h2")
  }
  
  try{
	  var chatname = base.childNodes[0].innerText;
	  if (showOnlyFirstName) {
		chatname = chatname.replace(/ .*/,'');
	  }
  } catch(e){
	  var chatname = base.innerText;
	  if (showOnlyFirstName) {
		chatname = chatname.replace(/ .*/,'');
	  }
  }
  
  var chatmessage = base.nextElementSibling.innerText;
  if (!chatmessage){
	   console.log("Not message found");
	   return;
  }
  var chatimg=false;
  try{
	 chatimg = base.parentNode.previousElementSibling.querySelector("img").src
  } catch(e){}
  
  var chatdonation = false;
  var chatmembership = false;
  var chatsticker = false;
  
  ele.style.backgroundColor = "#CCC";

  var chatbadges = "";
 
  // Mark this comment as shown
  ele.classList.add("shown-comment");

  var hasDonation = '';
 
  var hasMembership = '';
 
  var backgroundColor = "";
  var textColor = "";
 
  /* var chattext = $(element).text(); // add this back in
  var chatWords = chattext.split(" ");
  if (!highlightWords){
	  highlightWords=[];
  }
  var highlights = chatWords.filter(value => highlightWords.includes(value.toLowerCase().replace(/[^a-z0-9]/gi, '')));
  $(element).removeClass("shown-comment");
  if(highlights.length > 0) {
	$(element).addClass("highlighted-comment");
  } */

  var data = {};
  data.chatname = chatname;
  data.chatbadges = chatbadges;
  data.backgroundColor = backgroundColor;
  data.textColor = textColor;
  data.chatmessage = chatmessage;
  data.chatimg = chatimg;
  data.hasDonation = hasDonation;
  data.hasMembership = hasMembership;
  data.type = "instagram";
  
  toDataURL(chatimg, function(dataUrl) {
	  data.chatimg = dataUrl;
	  pushMessage(data);
  });

  $( "highlight-chat" ).removeClass("preview").append('<div class="hl-c-cont fadeout">'
     + '<div class="hl-name">' + chatname
       + '<div class="hl-badges">' + chatbadges + '</div>'
     + '</div>'
     + '<div class="hl-message" style="'+backgroundColor+' '+textColor+'">' + chatmessage + '</div>'
     + '<div class="hl-img"><img id="img_'+chatname+'" src="' + chatimg + '"></div>'
     +hasDonation+hasMembership
   +'</div>')
  .delay(10).queue(function(next){
    $( ".hl-c-cont" ).removeClass("fadeout");
    next();
  });
};

document.querySelector("body").innerHTML += '<button class="btn-clear-instagram">CLEAR</button><button class="btn-getoverlay-instagram" >LINK</button><highlight-chat class="highlight-instagram"></highlight-chat>';

$("body").on("click", ".btn-clear-instagram", function () {
  pushMessage(false);
  $(".hl-c-cont").addClass("fadeout").delay(300).queue(function(){
    $(".hl-c-cont").remove().dequeue();
  });
});

$("body").on("click", ".btn-getoverlay-instagram", function () {
    prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
});


// Show a placeholder message so you can position the window before the chat is live

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


function startup(containerSelector, className, callback, role=false) {
	var bases = document.querySelectorAll('li[role="menuitem"]');
	for (var i=0;i<bases.length;i++) {
	  initMessage(bases[i]);
	}

	try {
		var chatmessage = "Sample chat message!";
		$( "highlight-chat" ).addClass("preview").append('<div class="hl-c-cont fadeout"><div class="hl-name">Sample User<div class="hl-badges"></div></div><div class="hl-message">' + chatmessage + '</div><div class="hl-img">:)</div></div>').delay(10).queue(function(next){
			$( ".hl-c-cont" ).removeClass("fadeout");
			next();
		});
	} catch(e){};


	try{
		var onMutationsObserved = function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.addedNodes.length) {
					for (var i = 0, len = mutation.addedNodes.length; i < len; i++) {
						try{
							if (className!==false){
								console.warn(mutation.addedNodes[i]);
								if(mutation.addedNodes[i].className == className) {
									callback(mutation.addedNodes[i]);
								}
							} else if (role){
								if(mutation.addedNodes[i].getAttribute("role") && (mutation.addedNodes[i].getAttribute("role") == role)) {
									callback(mutation.addedNodes[i]);
								}
							}
						} catch(e){console.warn(e)}
					}
				}
			});
		};
		try{
			var target = document.querySelectorAll(containerSelector)[0];
			var config = { childList: true, subtree: true };
			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
			var observer = new MutationObserver(onMutationsObserved);
			observer.observe(target, config);
		} catch(e){console.warn(e);};
	} catch(e){console.error(e);}
}

setTimeout(function(){startup("article[role='presentation']", false, initMessage, 'menuitem');},1000);

})();
