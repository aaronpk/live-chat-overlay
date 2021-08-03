
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
var enabled = false;
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
  
  if (this.targetEle){
	  ele = this.targetEle.parentNode;;
	  console.log(ele);
  } else if (this){
	  ele = this.parentNode;
  }
  
  try {
	document.querySelector(".hl-c-cont").parentNode.removeChild(document.querySelector(".hl-c-cont"));
  } catch(e){}
  
  var base = ele.querySelector("[data-testid='tweet']");
  console.log(base.parentNode);
  
  try{
	  var chatname = base.childNodes[1].querySelectorAll("a")[0].childNodes[0].childNodes[0].innerText.trim();
	  if (!chatname.length){
		  chatname = base.childNodes[1].querySelectorAll("a")[0].innerText.trim();
	  }
	  if (showOnlyFirstName) {
		chatname = chatname.replace(/ .*/,'');
	  }
  } catch(e){
	 var chatname="";
	//return;
  }
  
  var chatimg=false;
  var contentimg=false;
  try{
	 chatimg = base.childNodes[0].querySelector("img").src
  } catch(e){}
  
  var chatmessage = "";
  try { // poster
	  
	  
	  chatmessage = base.parentNode.childNodes[1].childNodes[1].querySelector("[lang]");
	  if (chatmessage){
		  console.log(chatmessage);
		  var links = chatmessage.querySelectorAll("a");
		  for (var i =0;i<links.length;i++){
			  if (links[i].innerText.length>15){
				links[i].innerText = links[i].innerText.substring(0, 15) + "...";
			  }
		  }
		  chatmessage = chatmessage.innerText;
	  }
	  console.log("1");
	  
	  if (!chatmessage.length){
		  console.log(".");
		  chatmessage =  base.parentNode.childNodes[1].childNodes[1].childNodes[1].innerText;
		   console.log("2");
	  }
	  try{
		contentimg = base.parentNode.querySelector("video").getAttribute("poster");
	  }catch(e){
		  try{
			contentimg = base.parentNode.childNodes[1].childNodes[1].querySelector("[lang]").parentNode.nextElementSibling.querySelector("img").src;
		  } catch(e){
				contentimg = base.parentNode.childNodes[1].childNodes[1].querySelector("[lang]").parentNode.nextElementSibling.querySelector("img").src;
		  }
	  }
	  
  } catch(e){
	   
	  if (!chatmessage){
		  console.log(ele.parentNode);
		  try{
			  if (ele.parentNode.querySelectorAll("[lang]").length){
				chatmessage =  ele.parentNode.querySelector("[lang]").innerText;
			  }
		  }catch(e){}
		  console.log("3");
	  } else {
		  console.log(chatmessage);
	  }
		  
	   try{
		contentimg = ele.parentNode.querySelector("video").getAttribute("poster"); //tweetPhoto
	  }catch(e){
		  try{
			contentimg = ele.parentNode.querySelector("[data-testid='tweetPhoto']").querySelector("img").src;
		  } catch(e){
			  try{
				contentimg = base.parentNode.childNodes[1].childNodes[1].childNodes[1].parentNode.nextElementSibling.querySelector("img").src;
			  } catch(e){}
		}
	  }
  }
  
  if (!chatmessage){chatmessage="";}
  
  console.log(contentimg);
  
  var chatdonation = false;
  var chatmembership = false;
  var chatsticker = false;
  
  
  base.style.backgroundColor = "#CCC!important";

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
  data.contentimg = contentimg;
  data.type = "twitter";
  
  if (data.type === "instagram"){
	  toDataURL(chatimg, function(dataUrl) {
		  data.chatimg = dataUrl;
		  pushMessage(data);
	  });
  } else {
	  pushMessage(data);
  }

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
var loaded=false;


$("body").on("click", ".btn-clear-twitter", function () {
  pushMessage(false);
  $(".hl-c-cont").addClass("fadeout").delay(300).queue(function(){
    $(".hl-c-cont").remove().dequeue();
  });
});

$("body").on("click", ".btn-getoverlay-twitter", function () {
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


$("body").on("click", "#startupbutton", function () {
    document.getElementById("startupbutton").remove();
	clearTimeout(preStartupInteval);
	startup();
});

document.getElementById("startupbutton")

function checkButtons(){
	var bases = document.querySelector('main[role="main"]').querySelectorAll('article[role="article"]');
	for (var i=0;i<bases.length;i++) {
		try {
			if (!bases[i].dataset.set){
				bases[i].dataset.set=true;
				var button  = document.createElement("button");
				button.onclick = prepMessage;
				button.innerHTML = "Show Overlay";
				button.style = "    width: 60px;    height: 60px;    padding: 4px;  margin: 10px; background-color: #c7f6c7; cursor:pointer;"
				button.className = "btn-push-twitter";
				button.targetEle = bases[i]
				//bases[i].appendChild(button);
				try{
					bases[i].querySelector('[data-testid="tweet"]').childNodes[0].appendChild(button);
				}catch(e){
					bases[i].appendChild(button);
				}
			}
		} catch(e){}
	}
	
	if (!document.getElementById("overlaybutton")){
		document.querySelector('header[role="banner"]').querySelectorAll('a[aria-label="Tweet"]')[0].parentNode.outerHTML += '<button id="overlaybutton" class="btn-clear-twitter">CLEAR OVERLAY</button><button class="btn-getoverlay-twitter" >SHOW OVERLAY LINK</button>';
	}
}
function startup() {
	checkButtons();
	setInterval(function(){
		checkButtons();
	}, 2000);
}

function preStartup(){
	if (!(document.getElementById("overlaybutton") || document.getElementById("startupbutton"))){
		document.querySelector('header[role="banner"]').querySelectorAll('a[aria-label="Tweet"]')[0].parentNode.outerHTML += '<button id="startupbutton" class="btn-clear-twitter">Enable Overlay Service</button>';
	}
}

setTimeout(function(){preStartup();},1000);

var preStartupInteval = setInterval(function(){preStartup();},5000);

})();
















