(function() {
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
var connecting = false;
function actionwtf(){ // steves personal socket server service
	if (soca){return;}
	
	soca = new WebSocket("wss://api.overlay.ninja");
	soca.onclose = function (){
		console.error("closed: reconnecting");
		clearTimeout(connecting);
		connecting = setTimeout(function(){soca=false;actionwtf(); },2000);
	};
	soca.onopen = function (){
		try {
			soca.send(JSON.stringify({"join":channel}));
			console.log("connected");
		} catch(e){
			console.error(e);
			soca.close();
			clearTimeout(connecting);
			connecting = setTimeout(function(){soca=false;actionwtf(); },2000);
		}
	};
	soca.onerror = function (e){
		console.error(e);
		soca.close();
		clearTimeout(connecting);
		connecting = setTimeout(function(){soca=false;actionwtf(); },2000);
	};
	
	chrome.storage.sync.set({
		streamID: channel
	});
}

function pushMessage(data){
	var message = {};
	message.msg = true;
	message.contents = data;
	console.log(message);
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

NodeList.prototype.forEach = Array.prototype.forEach

function prepMessage(ele){
  if (ele == window){return;}
  var chatimg = "";
  try{
	   chatimg = ele.querySelector(".avatar img").src;
  } catch(e){ }
 
  var name = "";
  try {
	name = ele.querySelector(".question-item__author").innerText;
  } catch(e){}
  
  var msg = "";
  try {
	msg = ele.querySelector('.question-item__body').innerText;
  } catch(e){
	  }
  if (msg){
	msg = msg.trim();
 }
  var data = {};
  data.chatname = name;
  data.chatbadges = "";
  data.backgroundColor = "";
  data.textColor = "";
  data.chatmessage = msg;
  data.chatimg = chatimg;
  data.hasDonation = "";
  data.hasMembership = "";;
  data.contentimg = "";
  data.type = "slido";
  
  pushMessage(data);
}

function prepMessage2(ele){
  if (ele == window){return;}
  var chatimg = "";
  try{
	   chatimg = ele.querySelector("ui-user-avatar img").src;
  } catch(e){ }
 
  var name = "";
  try {
	name = ele.querySelector(".eq-item-header__text").innerText;
  } catch(e){}
  
  var msg = "";
  try {
	msg = ele.querySelector('.eq-item-content__text').innerText;
  } catch(e){ }
  
  if (msg){
	msg = msg.trim();
  }
  var data = {};
  data.chatname = name;
  data.chatbadges = "";
  data.backgroundColor = "";
  data.textColor = "";
  data.chatmessage = msg;
  data.chatimg = chatimg;
  data.hasDonation = "";
  data.hasMembership = "";;
  data.contentimg = "";
  data.type = "slido";
  
  pushMessage(data);
}

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
});


function startup() {
	console.log("STARTED");
	setTimeout(function(){actionwtf();},10);
	
	setInterval(function(){
		
		if (!window.location.pathname.endsWith("/questions")){
			return;
		}
		
		try {
			var main = document.querySelectorAll("admin-event-questions-item-desktop");
			for (var j =0;j<main.length;j++){
				if (!main[j].dataset.set){
					main[j].dataset.set = "true";
					main[j].insertAdjacentHTML('afterbegin', '<div><span><a class="btn-push-slido" style="color:green;font-weight:700;">ADD</a></span><span><a class="btn-clear-slido"  style="color:red;">CLEAR</a></span><span><a class="btn-getoverlay-slido" >LINK</a></span></div>');
					
					main[j].querySelector(".btn-push-slido").onclick = function(){
						prepMessage2(this.parentNode.parentNode.parentNode);
					};
					
					main[j].querySelector(".btn-getoverlay-slido").onclick = function(){
						prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
					};
					
					main[j].querySelector(".btn-clear-slido").onclick = function(){
						pushMessage(false);
					}
				}
			}
		} catch(e){ }
		
		try {
			var main = document.querySelector(".question-list__container").querySelectorAll('[data-cy="question-list-item"]');
			for (var j =0;j<main.length;j++){
				try{
					if (!main[j].dataset.set){
						main[j].dataset.set = "true";
						main[j].insertAdjacentHTML('afterbegin', '<div><span><a class="btn-push-slido" style="color:green;font-weight:700;">ADD</a></span><span><a class="btn-clear-slido"  style="color:red;">CLEAR</a></span><span><a class="btn-getoverlay-slido" >LINK</a></span></div>');
						
						main[j].querySelector(".btn-push-slido").onclick = function(){
							prepMessage(this.parentNode.parentNode.parentNode);
						};
						
						main[j].querySelector(".btn-getoverlay-slido").onclick = function(){
							prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
						};
						
						main[j].querySelector(".btn-clear-slido").onclick = function(){
							pushMessage(false);
						}
					}
				} catch(e){}
			}
		} catch(e){ }
	},1500);
}
console.log("STARTING");
startup();
})();
