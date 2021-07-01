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

var showOnlyFirstName;

var highlightWords = [];


$("body").unbind("click").on("click", "div.MuiGrid-root.MuiGrid-container > div > section:first-child > div:first-child > div:first-child > div", function (event) {
	console.log(event.target);

	if (!$(this)[0].childNodes.length){return;}
	if (event.target.querySelectorAll("input").length){return;}

	var button1 = document.createElement("button");
	button1.innerHTML = "Add";
	button1.style.cursor = "pointer";
	button1.style.margin = "10px";
	button1.style.padding = "5px";
	button1.style.backgroundColor = "#CFC";
	
	var button2 = document.createElement("button");
	button2.innerHTML = "Clear all";
	button2.style.cursor = "pointer";
	button2.style.margin = "10px";
	button2.style.backgroundColor = "#FCC";
	button2.style.padding = "5px";
	
	var button3 = document.createElement("button");
	button3.innerHTML = "Get Overlay Link";
	button3.style.cursor = "pointer";
	button3.style.margin = "10px";
	button3.style.backgroundColor = "#CCF";
	button3.style.padding = "5px";
	
	if (event.target.tagName.toLowerCase() == "input"){
		return;
	} else if (event.target.tagName.toLowerCase() == "button"){
		return;
	} else if (event.target.tagName.toLowerCase() == "img"){
		var buttonlist = $(this)[0].parentNode.parentNode.querySelectorAll("button");
		for (var i = 0; i< buttonlist.length;i++){
			buttonlist[i].remove();
		}
		
		$(this)[0].parentNode.parentNode.appendChild(button1);
		$(this)[0].parentNode.parentNode.appendChild(button2);
		$(this)[0].parentNode.parentNode.appendChild(button3);
	} else {
		var buttonlist = $(this)[0].parentNode.parentNode.querySelectorAll("button");
		for (var i = 0; i< buttonlist.length;i++){
			buttonlist[i].remove();
		}
		
		$(this)[0].appendChild(button1);
		$(this)[0].appendChild(button2);
		$(this)[0].appendChild(button3);
	}
	
	var content = $(this)[0].childNodes[0].childNodes[1];
	
	var chatimg="";
	try{
		chatimg = content.parentNode.childNodes[0].querySelectorAll("img")[0].src;
	} catch(e){
		try {
			chatimg = content.childNodes[0].querySelectorAll("img")[0].src;
		} catch(e){}
	}
	
	var chatname="";
	try {
		chatname = content.childNodes[0].childNodes[0].childNodes[0].childNodes[1].textContent;
		chatname = chatname.replace(/ .*/,'');
	} catch(e){
		try {
			chatname = content.childNodes[0].childNodes[0].childNodes[0].textContent;
			chatname = chatname.replace(/ .*/,'');
		} catch(e){}
	}
	
	var chatmessage="";
	try{
		chatmessage = content.childNodes[0].childNodes[1].innerHTML;
	}catch(e){}
	
  var data = {};
  data.chatname = chatname;
  data.chatbadges = "";
  data.backgroundColor = "";
  data.textColor = "";
  data.chatmessage = chatmessage;
  data.chatimg = chatimg;
  data.hasDonation = "";
  data.hasMembership = "";
  data.type = "restream";
  
  button1.onclick = function(){
	pushMessage(data);
  }
  
  button2.onclick = function(){
	pushMessage(false);
  }
  
  button3.onclick = function(){
     prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
  }
  
});




var properties = ["color","scale","streamID","sizeOffset","commentBottom","commentHeight","authorBackgroundColor","authorAvatarBorderColor","authorColor","commentBackgroundColor","commentColor","fontFamily","showOnlyFirstName","highlightWords"];
chrome.storage.sync.get(properties, function(item){
  var color = "#000";
  if(item.color) {
    color = item.color;
  }
  if (item.streamID){
    channel = item.streamID;
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


setTimeout(function(){

	var button2 = document.createElement("button");
	button2.innerHTML = "Clear all";
	button2.style.cursor = "pointer";
	button2.style.margin = "10px";
	button2.style.backgroundColor = "#FCC";
	button2.style.padding = "5px";
	
	var button3 = document.createElement("button");
	button3.innerHTML = "Get Overlay Link";
	button3.style.cursor = "pointer";
	button3.style.margin = "10px";
	button3.style.backgroundColor = "#CCF";
	button3.style.padding = "5px";
	
	button2.onclick = function(){
		pushMessage(false);
	}
	  
	button3.onclick = function(){
		 alreadyPrompted=true;
		 prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
	}

		
	document.querySelector("#root").prepend(button2);
	document.querySelector("#root").prepend(button3);
	

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

	onElementInsertedTwitch("#root", "jss528", function(element){
	  // Check for highlight words
	  
	  var chattext = $(element).text();
	  var chatWords = chattext.split(" ");
	  if (!highlightWords){
		  highlightWords=[];
	  }
	  var highlights = chatWords.filter(value => highlightWords.includes(value.toLowerCase().replace(/[^a-z0-9]/gi, '')));
	  if(highlights.length > 0) {
		$(element).addClass("highlighted-comment");
	  }
	});
		
},2000);