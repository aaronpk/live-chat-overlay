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
  
  console.log(ele);
  
  var img = false;
  var chatimg = "";
  try{
	   chatimg = ele.querySelector("img.avatar").src;
	   img = true;
  } catch(e){
	
  }
  
  try{
	   chatimg = ele.querySelector(".avatar").querySelector("img").src;
	   img = true;
  } catch(e){
	
  }
  
  if (!chatimg){
	  chatimg = "https://chat.overlay.ninja/youtube.png";
  }
  console.log(chatimg);
  
  var name = ele.querySelector(".creator").innerText;
  if (name){
	name = name.replace("Reply From","");
	name = name.trim();
  }
  
  if (!name){
	try{
		name = ele.querySelector(".creator").querySelector("img").src;
		name = "<img src='"+name+"' alt='YouTube'/>";
	} catch(e){
		
	}
  }
  
  
  console.log(name);
  
  var msg = "";
  try {
	console.log(ele);
	msg = ele.querySelector('div.text').innerText;
  } catch(e){
	
  }
  if (msg){
	msg = msg.trim();
	if (name){
		if (msg.startsWith(name)){
			msg = msg.replace(name, '');
			msg = msg.trim();
		}
	}
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
  data.type = "youtube";
  
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
		try {
			var main = document.querySelector(".questions").querySelectorAll("div.question.page-constraint");
		} catch(e){ return; }
		for (var j =0;j<main.length;j++){
			try{
				if (!main[j].dataset.set){
					main[j].dataset.set = "true";
					main[j].insertAdjacentHTML('afterbegin', '<div><span><a class="btn-push-withyoutube" style="margin-right:10px;color:green;font-weight:700;">ADD</a></span><span><a class="btn-clear-withyoutube"  style="margin-right:10px;color:red;">CLEAR</a></span><span><a class="btn-getoverlay-withyoutube" >LINK</a></span></div>');
					
					main[j].querySelector(".btn-push-withyoutube").onclick = function(){
						prepMessage(this.parentNode.parentNode.parentNode.parentNode);
					};
					
					main[j].querySelector(".btn-getoverlay-withyoutube").onclick = function(){
						prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
					};
					
					main[j].querySelector(".btn-clear-withyoutube").onclick = function(){
						pushMessage(false);
					}
				}
			} catch(e){}
		}
		
		try {
			var main = document.querySelector(".questions").querySelectorAll("div.reply.page-constraint");
		} catch(e){ return; }
		for (var j =0;j<main.length;j++){
			try{
				if (!main[j].dataset.set){
					main[j].dataset.set = "true";
					main[j].insertAdjacentHTML('afterbegin', '<div><span><a class="btn-push-withyoutube" style="margin-right:10px;color:green;font-weight:700;">ADD</a></span><span><a class="btn-clear-withyoutube"  style="margin-right:10px;color:red;">CLEAR</a></span><span><a class="btn-getoverlay-withyoutube" >LINK</a></span></div>');
					
					main[j].querySelector(".btn-push-withyoutube").onclick = function(){
						prepMessage(this.parentNode.parentNode.parentNode);
					};
					
					main[j].querySelector(".btn-getoverlay-withyoutube").onclick = function(){
						prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
					};
					
					main[j].querySelector(".btn-clear-withyoutube").onclick = function(){
						pushMessage(false);
					}
				}
			} catch(e){}
		}
	},2000);
}
console.log("STARTING");
startup();
})();
