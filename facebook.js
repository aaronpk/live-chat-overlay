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
var connecting = false;
function actionwtf(){ // steves personal socket server service
	if (soca){return;}
	
	soca = new WebSocket("wss://api.action.wtf:666");
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
  
  var chatimg = "";
  try{
	   chatimg = ele.childNodes[0].querySelector("img").src;
  } catch(e){
	  try{
	   chatimg = ele.childNodes[0].querySelector("image").href.baseVal;
	  } catch(e){
		  
	  }
  }
 
  console.log(chatimg);
  var name = ele.childNodes[1].querySelector('a[role="link"]').innerText;
  if (name){
	name = name.trim();
  }
  console.log(name);
  
  var msg = "";
  try {
	  console.log(ele);
	ele.childNodes[1].querySelector('a[role="link"]').parentNode.parentNode.parentNode.querySelector('span[lang]').querySelectorAll('*').forEach(function(node) {
		
		if (node.nodeName == "IMG"){
			msg+=node.outerHTML;
			console.log(node.outerHTML);
		} else {
			node.childNodes.forEach(function(nn){
				try{
					if (nn.nodeName === "#text"){
						msg+=nn.textContent;
					}
				}catch(e){}
			});
		}
		
	});
  } catch(e){
	console.error(e);
	ele.childNodes[1].querySelector('a[role="link"]').parentNode.parentNode.parentNode.querySelectorAll('*').forEach(function(node) {
		console.warn(node);
		if (node.nodeName == "IMG"){
			msg+=node.outerHTML;
			console.log(node.outerHTML);
		} else {
			node.childNodes.forEach(function(nn){
				try{
					if (nn.nodeName === "#text"){
						msg+=nn.textContent;
					}
				}catch(e){}
			});
		}
	});
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
  data.type = "facebook";
  
  if (data.type === "facebook"){
	   if (data.contentimg){
		  toDataURL(contentimg, function(dataUrl) {
			  data.contentimg = dataUrl;
			  if (data.chatimg){
					toDataURL(data.chatimg, function(dataUrl) {
						data.chatimg = dataUrl;
						pushMessage(data);
					});
			  } else {
				   pushMessage(data);
			  }
		  });
	    } else if (data.chatimg){
			toDataURL(data.chatimg, function(dataUrl) {
				data.chatimg = dataUrl;
				pushMessage(data);
			});
		} else {
			data.chatimg = "https://chat.overlay.ninja/facebook.png";
		    pushMessage(data);
		}
  } else {
	  pushMessage(data);
  }
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

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function startup() {
	console.log("STARTED");
	setTimeout(function(){actionwtf();},10);
	
	setInterval(function(){
		try {
			var main = document.querySelector("div[role='complementary']").querySelectorAll("div[role='article']");
		} catch(e){ return; }
		for (var j =0;j<main.length;j++){
			try{
				if (!main[j].childNodes[1].childNodes[1].dataset.set){
					main[j].childNodes[1].childNodes[1].dataset.set = "true";
					var newNode = main[j].childNodes[1].childNodes[1].childNodes[1].cloneNode();
					newNode.innerHTML = '<span><a class="btn-push-facebook">ADD</a></span><span><a class="btn-clear-facebook">CLEAR</a></span><span><a class="btn-getoverlay-facebook" >LINK</a></span>';
					insertAfter(newNode, main[j].childNodes[1].childNodes[1].childNodes[1]) 
					newNode.querySelector(".btn-push-facebook").onclick = function(){prepMessage(this.parentNode.parentNode.parentNode.parentNode.parentNode);};
					newNode.querySelector(".btn-getoverlay-facebook").onclick = function(){
						prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
					};
					newNode.querySelector(".btn-clear-facebook").onclick = function(){pushMessage(false);}
				}
			} catch(e){}
		}
	},2000);
}
console.log("STARTING");
startup();
})();
