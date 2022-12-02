(function() {
	
	
	if (window.location.href.indexOf("/live/") > -1) {
		console.log("Instagram live detected");
		return;
	}
	
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

function actionwtf(){ // steves personal socket server service
	if (soca){return;}

	soca = new WebSocket("wss://api.overlay.ninja");
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

function prepMessage2(ele){ // ele is an article
  if (ele == window){return;}
  
  var img = "";
  var contentimg = "";
  
  try{
	   img = document.querySelector("div > ul > div[role='button'] img").src;
  } catch(e){
	  
  }
 
  var msg="";
  try{
	  msg = document.querySelector("div > ul > div[role='button'] h2").nextElementSibling.innerText;
  } catch(e){}
  
  
  var contentimg = "";
  try {
	contentimg = document.querySelector("article").childNodes[0].childNodes[0].querySelector("img").src;
  } catch(e){
	  console.log(e);
  }
  
   if (!contentimg){
	  try {
			contentimg = document.querySelector("article").querySelector("video").getAttribute("poster");;
	  } catch(e){}
  }
  
  if (!contentimg){
	  try {
			contentimg = ele.querySelector("img").getAttribute("poster");
	  } catch(e){}
  }
  
  try {
		var name = document.querySelector("div > ul > div[role='button'] h2").innerText;
  } catch(e){
		console.log(e);
  }
  
  var data = {};
  data.chatname = name;
  data.chatbadges = "";
  data.backgroundColor = "";
  data.textColor = "";
  data.chatmessage = msg;
  data.chatimg = img;
  data.hasDonation = "";
  data.hasMembership = "";;
  data.contentimg = contentimg;
  data.type = "instagram";
  
  if (data.type === "instagram"){
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
		   pushMessage(data);
		}
  } else {
	  pushMessage(data);
  }
}

function prepMessage(ele){ // ele is an article
  if (ele == window){return;}
  
  if ( window.location.href.includes("/p/")){
	  prepMessage2(ele);
	  return;
  }
  
  var contentimg = "";
  
  try{
	   contentimg = ele.childNodes[0].childNodes[1].querySelector("img").src;
  } catch(e){
	  
  }
  if (!contentimg){
	  try {
			contentimg = ele.querySelector("video").getAttribute("poster");;
	  } catch(e){}
  }
  
  if (!contentimg){
	  try {
			contentimg = ele.querySelector("img").getAttribute("poster");
	  } catch(e){}
  }
 
  
  var msg="";
  try{
	  var contents = ele.querySelector('span > a > span > div').parentNode.parentNode.parentNode.nextElementSibling.nextElementSibling;
	  var msg = contents.innerText;
  } catch(e){}
  
  
  var img = "";
  try {
	img = ele.childNodes[0].childNodes[0].querySelector("header img").src;
  } catch(e){
	  console.log(e);
  }
  
  try {
		var name = ele.querySelector('span > a > span > div').innerText;
  } catch(e){
		console.log(e);
  }
  
  var data = {};
  data.chatname = name;
  data.chatbadges = "";
  data.backgroundColor = "";
  data.textColor = "";
  data.chatmessage = msg;
  data.chatimg = img;
  data.hasDonation = "";
  data.hasMembership = "";;
  data.contentimg = contentimg;
  data.type = "instagram";
  
  if (data.type === "instagram"){
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
		   pushMessage(data);
		}
  } else {
	  pushMessage(data);
  }
}

function prepComment(ele){ // ele is an article
  if (ele == window){return;}
  
  var contentimg = "";



  var name = "";
  try {
		name = ele.parentNode.parentNode.querySelector("h3").innerText;
  } catch(e){
	  try {
		  name = ele.parentNode.parentNode.querySelector("h3").innerText;
	  } catch(e){
		  
	  }
  }
  
  var msg="";
  try{
	  msg = ele.parentNode.parentNode.querySelector("h3").nextElementSibling.innerText;
  } catch(e){
	  console.log(e);
  }
  
  
 
  var img = "";
  try {
	img = ele.parentNode.parentNode.previousElementSibling.querySelector("img").src;
  } catch(e){}
  
  var data = {};
  data.chatname = name;
  data.chatbadges = "";
  data.backgroundColor = "";
  data.textColor = "";
  data.chatmessage = msg;
  data.chatimg = img;
  data.hasDonation = "";
  data.hasMembership = "";;
  data.contentimg = contentimg;
  data.type = "instagram";
  
  if (data.type === "instagram"){
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
		   pushMessage(data);
		}
  } else {
	  pushMessage(data);
  }
}

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


function startup() {
	console.log("STARTED");
	setTimeout(function(){actionwtf();},1010);
	
	setInterval(function(){
		var main = document.querySelectorAll("article section:first-child");
		for (var j =0;j<main.length;j++){
			try{
				if (!main[j].dataset.set){
					main[j].innerHTML += '<span><button class="ignore btn-push-instagram">OVERLAY</button></span><span><button class="ignore btn-clear-instagram">CLEAR</button></span><span><button class="ignore btn-getoverlay-instagram" >LINK</button></span>';
					main[j].dataset.set = true;	
				}
			} catch(e){
				console.error(e);
			}
		}
	},2000);
	
	setInterval(function(){
		var main = document.querySelector("article div > div > ul").childNodes;
		for (var j =0;j<main.length;j++){
			try{
				if (!main[j].dataset.set){
					try {
						main[j].querySelector("button:not(.ignore").parentNode.parentNode.parentNode.innerHTML += '<span><button class="ignore btn-push-instagram publish2">OVERLAY</button>';
					} catch(e){console.log(e);}
					main[j].dataset.set = true;	
				}
			} catch(e){
				console.error(e);
			}
		}
	},2000);
	
	$("body").on("click", ".btn-clear-instagram", function () {
		  pushMessage(false);
	});

	$("body").on("click", ".btn-getoverlay-instagram", function () {
			prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
	});
	
	$("body").on("click", ".publish2", function () {
		console.log(this);
		prepComment(this);
	});
	
	$("body").on("click", ".btn-push-instagram", function (e) {
		var ele = this;
		for (var i=0;i<10;i++){
			if (ele.parentNode.nodeName == "ARTICLE"){
				console.log(ele.parentNode);
				prepMessage(ele.parentNode);
				break;
			} else {
				ele = ele.parentNode
			}
		}
	});
	
}
console.log("STARTING");
startup();

})();
