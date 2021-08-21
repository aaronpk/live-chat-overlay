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

function prepMessage(ele){
  if (ele == window){return;}
  
  var contentimg = "";
  
  try{
	   contentimg = ele.previousElementSibling.childNodes[0].querySelector("img").src;
  } catch(e){
	  
  }
  if (!contentimg){
	  try {
			contentimg = ele.previousElementSibling.childNodes[0].querySelector("video").getAttribute("poster");;
	  } catch(e){}
  }
  
  if (!contentimg){
	  try {
			contentimg = ele.querySelector("video").getAttribute("poster");
	  } catch(e){}
  }
  if (!contentimg){
	  try {
			contentimg = ele.querySelector("img").getAttribute("poster");
	  } catch(e){}
  }
   
  
  console.log(contentimg);
  var contents = ele;
  contents = ele.querySelector('div[data-testid="post-comment-root"]');
  var name2="";
  var msg="";
  try{
	  var name2 = contents.childNodes[0].innerText;
	  var msg = contents.children[1].innerText;
  } catch(e){}
  
  console.log(contents);
  
  console.log(contentimg);
  console.log(name);
  console.log(msg);
  
  console.log(ele.parentNode);
  var img = ele.parentNode.childNodes[0].childNodes[0].querySelector("img").src;
  console.log(img);
  var name = ele.parentNode.childNodes[0].childNodes[1].childNodes[0].querySelector("a").innerText.trim();
  console.log(name);
   
  if (!name){name=name2;}

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
function prepMessage2(ele){
	
  if (ele == window){return;}

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
  
  ele.style.backgroundColor = "#CCC";
  // Mark this comment as shown
  ele.classList.add("shown-comment");

  var data = {};
  data.chatname = chatname;
  data.chatbadges = "";
  data.backgroundColor = "";
  data.textColor = "";
  data.chatmessage = chatmessage;
  data.chatimg = chatimg;
  data.hasDonation = "";
  data.hasMembership = "";
  data.type = "instagram";
  
  toDataURL(chatimg, function(dataUrl) {
	  data.chatimg = dataUrl;
	  pushMessage(data);
  });

};


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
		var main = document.querySelectorAll("article[role='presentation']");
		for (var j =0;j<main.length;j++){
			try{
				if (!main[j].childNodes[3].childNodes[0].dataset.set){
					main[j].childNodes[3].childNodes[0].innerHTML += '<span><button class="btn-push-instagram">OVERLAY</button></span><span><button class="btn-clear-instagram">CLEAR</button></span><span><button class="btn-getoverlay-instagram" >LINK</button></span>';
					main[j].childNodes[3].childNodes[0].dataset.set = true;	
				}
			} catch(e){}
			var subMain = main[j].querySelectorAll("[role='menuitem']");
			for (var i =0;i<subMain.length;i++){
				if (subMain[i].dataset.set){continue;}
				subMain[i].innerHTML += '<span><button class="btn-push-instagram-sub">OVERLAY</button></span><span><button class="btn-clear-instagram">CLEAR</button></span><span><button class="btn-getoverlay-instagram" >LINK</button></span>';
				subMain[i].dataset.set = true;
			}
		}
	},2000);
	
	$("body").on("click", ".btn-clear-instagram", function () {
		  pushMessage(false);
	});

	$("body").on("click", ".btn-getoverlay-instagram", function () {
			prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
	});
	
	$("body").on("click", ".btn-getoverlay-instagram", function () {
			prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
	});
	
	$("body").on("click", ".btn-push-instagram", function (e) {
			console.log(this.parentNode.parentNode.parentNode);
			prepMessage(this.parentNode.parentNode.parentNode);
	});
	
	$("body").on("click", ".btn-push-instagram-sub", function (e) {
			console.log(this.parentNode.parentNode);
			prepMessage2(this.parentNode.parentNode);
	});
	
	
}
console.log("STARTING");
startup();

})();
