var showOnlyFirstName;
var highlightWords = [];
var sessionID = "";
var remoteWindowURL = "https://chat.aaronpk.tv/overlay/";
var remoteServerURL = remoteWindowURL + "pub";
var version = "0.3.0";
var config = {};
var lastId = "";

$("body").unbind("click").on("click", "yt-live-chat-text-message-renderer,yt-live-chat-paid-message-renderer,yt-live-chat-membership-item-renderer,yt-live-chat-paid-sticker-renderer", function () {

  // Don't show deleted messages
  if($(this)[0].hasAttribute("is-deleted")) {
    console.log("Not showing deleted message");
    return;
  }

  if (sessionID && this.id === lastId) {
    lastId = "";
    var remote = {
      version: version,
      command: "hide"
    };
    $.post(remoteServerURL+"?id="+sessionID, JSON.stringify(remote));
    return;
  }

  // Mark this comment as shown
  $(this).addClass("shown-comment");

  /* 
   Properties to send to remote window:

   message
   authorName
   authorImg
   badges
   donation
   sticker
   membership
   backgroundColor
   textColor
   */

  var data = {};


  data.message = $(this).find("#message").html();

  $(this).find("#author-name #tooltip.hidden").remove();
  data.authorName = $(this).find("#author-name").text();

  if(showOnlyFirstName) {
    data.authorName = data.authorName.replace(/ [^ ]+$/, '');
  }

  data.authorImg = $(this).find("#img").attr('src').replace("32", "128");

  data.badges = '';
  if($(this).find("#chat-badges .yt-live-chat-author-badge-renderer img").length > 0) {
    data.badges = $(this).find("#chat-badges .yt-live-chat-author-badge-renderer img").parent().html();
  }

  data.donation = $(this).find("#purchase-amount").html();

  data.sticker = $(this).find(".yt-live-chat-paid-sticker-renderer #img").attr("src");

  // Donation amounts for stickers use a differnet id than regular superchats
  if(data.sticker) {
    data.donation = $(this).find("#purchase-amount-chip").html();
  }

  data.membership = $(this).find(".yt-live-chat-membership-item-renderer #header-subtext").html();

  data.backgroundColor = "";
  data.textColor = "";
  if(this.style.getPropertyValue('--yt-live-chat-paid-message-primary-color')) {
    data.backgroundColor = "background-color: "+this.style.getPropertyValue('--yt-live-chat-paid-message-primary-color')+";";
    data.textColor = "color: #111;";
  }

  // This doesn't work yet
  if(this.style.getPropertyValue('--yt-live-chat-sponsor-color')) {
    data.backgroundColor = "background-color: "+this.style.getPropertyValue('--yt-live-chat-sponsor-color')+";";
    data.textColor = "color: #111;";
  }


  if(sessionID) {
    var remote = {
      version: version,
      command: "show",
      data: data,
      config: config
    }
    lastId = this.id;
    $.post(remoteServerURL+"?id="+sessionID, JSON.stringify(remote));

  }

});

$("body").on("click", ".btn-clear", function () {
  var remote = {
    version: version,
    command: "hide"
  };
  $.post(remoteServerURL+"?id="+sessionID, JSON.stringify(remote));
});

// Restore settings
var configProperties = ["color","scale","sizeOffset","commentBottom","commentHeight","authorBackgroundColor","authorAvatarBorderColor","authorColor","commentBackgroundColor","commentColor","fontFamily","showOnlyFirstName","highlightWords","popoutURL"];
chrome.storage.sync.get(configProperties, function(item){
  var color = "#000";
  if(item.color) {
    color = item.color;
  }

  showOnlyFirstName = item.showOnlyFirstName;
  highlightWords = item.highlightWords;

  if(item.popoutURL) {
    remoteWindowURL = item.popoutURL;
    remoteServerURL = remoteWindowURL + "pub";
  }

  config = item;
});


$("#primary-content").append('<span style=""><a href="#" id="pop-out-button" class="button">Get Overlay URL</a></span>');
$("#primary-content").append('<span class="hidden"><input type="url" readonly id="pop-out-url"></span>');

$("#pop-out-button").click(function(e){
  e.preventDefault();

  if(!sessionID) {
    if(window.location.hash) {
      sessionID = window.location.hash.replace("#", "");
    } else {
      sessionID = generateSessionID();
      window.location.hash = sessionID;
    }
  }

  $("#pop-out-url").val(remoteWindowURL+"#"+sessionID);
  $("#pop-out-url").parent().removeClass("hidden");

  $("highlight-chat").remove();
  $("body").removeClass("inline-chat");
});

$("#pop-out-url").click(function(){
  $(this).select();
});


$(function(){

  // Restore the popout URL field if they refresh the page
  if(window.location.hash) {
    $("#pop-out-button").click();
  }

});



function generateSessionID(){
  var text = "";
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  for (var i = 0; i < 10; i++){
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
};

function onElementInserted(containerSelector, tagName, callback) {

    var onMutationsObserved = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                for (var i = 0, len = mutation.addedNodes.length; i < len; i++) {
                    if(mutation.addedNodes[i].tagName == tagName.toUpperCase()) {
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


onElementInserted(".yt-live-chat-item-list-renderer#items", "yt-live-chat-text-message-renderer", function(element){
  //console.log("New dom element inserted", element.tagName);
  // Check for highlight words
  var chattext = $(element).find("#message").text();
  var chatWords = chattext.split(" ");
  var highlights = chatWords.filter(value => highlightWords.includes(value.toLowerCase().replace(/[^a-z0-9]/gi, '')));
  $(element).removeClass("shown-comment");
  if(highlights.length > 0) {
    $(element).addClass("highlighted-comment");
  }
});

