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


$("#react-root").unbind("click").on("click", "div>div>section>div", function (event) {
	console.log(event.target);
	console.log(this);
	if (!this.childNodes.length){return;}
	var content = this.childNodes[0].childNodes[1];
	
	this.style.backgroundColor = "#cccc";
	
	var chatname="";
	try {
		chatname = this.childNodes[0].childNodes[0].childNodes[1].children[0].textContent;
		chatname = chatname.replace(/ .*/,'');
	} catch(e){
		console.error(e);
	}
	var chatmessage="";
	try{
		chatmessage = this.childNodes[0].childNodes[0].childNodes[1].children[1].innerHTML;
	}catch(e){console.error(e);}
	
	var chatimg="";
	try{
		chatimg = this.childNodes[0].childNodes[0].childNodes[0].querySelectorAll("img")[0].src;
	} catch(e){
		console.error(e);
	}
	
  var data = {};
  data.chatname = chatname;
  data.chatbadges = "";
  data.backgroundColor = "";
  data.textColor = "";
  data.chatmessage = chatmessage;
  data.chatimg = chatimg;
  data.hasDonation = "";
  data.hasMembership = "";
  data.contentimg = "";
  data.type = "instalive";
  
  
  console.log(data);
  
  if (data.type === "instalive"){
	 if (data.chatimg){
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
  
});

var properties = ["streamID"];
chrome.storage.sync.get(properties, function(item){
  if (item.streamID){
    channel = item.streamID;
  } else {
	chrome.storage.sync.set({
		streamID: channel
	});
  }
});


setTimeout(function(){

	document.head.insertAdjacentHTML("beforeend", `<style>div>div>section>div:hover{cursor: pointer;background-color: #6b94;}</style>`)


	var button2 = document.createElement("button");
	button2.innerHTML = "Clear all";
	button2.style.cursor = "pointer";
	button2.style.margin = "10px";
	button2.style.backgroundColor = "#FCC";
	button2.style.padding = "5px";
	button2.style.width = "75px";
	
	var button3 = document.createElement("button");
	button3.innerHTML = "Get link";
	button3.style.cursor = "pointer";
	button3.style.margin = "10px";
	button3.style.backgroundColor = "#CCF";
	button3.style.padding = "5px";
	button3.style.width = "75px";
	
	button2.onclick = function(){
		pushMessage(false);
	}
	  
	button3.onclick = function(){
		 prompt("Overlay Link: https://chat.overlay.ninja?session="+channel+"\nAdd as a browser source; set height to 250px", "https://chat.overlay.ninja?session="+channel);
	}
		
	document.querySelector("[data-testid='live-badge']").appendChild(button2);
	document.querySelector("[data-testid='live-badge']").appendChild(button3);

},2000);