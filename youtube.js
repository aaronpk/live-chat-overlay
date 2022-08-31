var showOnlyFirstName;

var highlightWords = [];
var sessionID = "";
var remoteWindowURL = "https://chat.aaronpk.tv/overlay/";
var remoteServerURL = remoteWindowURL + "pub";
var version = "0.3.3";
var config = {};
var lastID = "";
var videoID = "";
var autoHideTimer = null;

$("body").unbind("click").on("click", "yt-live-chat-text-message-renderer,yt-live-chat-paid-message-renderer,yt-live-chat-membership-item-renderer,yt-live-chat-paid-sticker-renderer", function () {

  $(".active-comment").removeClass("active-comment");

  clearTimeout(autoHideTimer);

  // Don't show deleted messages
  if($(this)[0].hasAttribute("is-deleted")) {
    console.log("Not showing deleted message");
    return;
  }

  var data = {};

  $(".hl-c-cont").remove();
  data.authorname = $(this).find("#author-name").text();

  if(showOnlyFirstName) {
    data.authorname = data.authorname.replace(/ [^ ]+$/, '');
  }

  data.message = $(this).find("#message").html();
  data.authorimg = $(this).find("#img").attr('src');
  data.authorimg = data.authorimg.replace("32", "128");
  data.donation = $(this).find("#purchase-amount").html();
  data.membership = $(this).find(".yt-live-chat-membership-item-renderer #header-subtext").html();
  data.sticker = $(this).find(".yt-live-chat-paid-sticker-renderer #img").attr("src");
  data.chatId = $(this).attr("id");

  // Donation amounts for stickers use a differnet id than regular superchats
  if(data.sticker) {
    data.donation = $(this).find("#purchase-amount-chip").html();
  }

  data.badges = "";
  if($(this).find("#chat-badges .yt-live-chat-author-badge-renderer img").length > 0) {
    data.badges = $(this).find("#chat-badges .yt-live-chat-author-badge-renderer img").parent().html();
  }

  if(data.chatId === lastID) {
    hideActiveChat();
    return;
  }

  // Mark this comment as shown
  $(this).addClass("shown-comment").addClass("active-comment");

  data.donationHTML = '';
  if(data.donation) {
    data.donationHTML = '<div class="donation">' + data.donation + '</div>';
  }

  data.membershipHTML = '';
  if(data.membership) {
    data.membershipHTML = '<div class="donation membership">NEW MEMBER!</div>';
    data.message = data.membership;
  }

  if(data.sticker) {
    data.message = '<img src="'+data.sticker+'">';
  }

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

  var html = '<div class="hl-c-cont fadeout">'
     + '<div class="hl-name">' + data.authorname
       + '<div class="hl-badges">' + data.badges + '</div>'
     + '</div>'
     + '<div class="hl-message" style="'+data.backgroundColor+' '+data.textColor+'">' + data.message + '</div>'
     + '<div class="hl-img"><img src="' + data.authorimg + '"></div>'
     +data.donationHTML+data.membershipHTML
   +'</div>';

  lastID = data.chatId;

  if(sessionID) {

    var remote = {
      version: version,
      command: "show",
      html: html,
      config: config,
      v: videoID
    }
    $.post(remoteServerURL+"?id="+sessionID, JSON.stringify(remote));

  } else {

    $( "highlight-chat" ).removeClass("preview").append(html)
    .delay(10).queue(function(next){
      $( ".hl-c-cont" ).removeClass("fadeout");
      next();
    });

  }

  if(config.autoHideSeconds && config.autoHideSeconds > 0) {
    autoHideTimer = setTimeout(function(){
      hideActiveChat();
    }, config.autoHideSeconds*1000);
  }

});

function hideActiveChat() {
  if(sessionID) {
    var remote = {
      version: version,
      command: "hide",
      v: videoID
    };
    $.post(remoteServerURL+"?id="+sessionID, JSON.stringify(remote));
  }

  $(".hl-c-cont").addClass("fadeout").delay(300).queue(function(){
    $(".hl-c-cont").remove().dequeue();
  });

  lastID = false;
}

$("body").on("click", ".btn-clear", function () {
  hideActiveChat();
});

$("yt-live-chat-app").before( '<highlight-chat></highlight-chat><button class="btn-clear">CLEAR</button>' );
$("body").addClass("inline-chat");

$(function(){

  // Show a placeholder message so you can position the window before the chat is live
  var data = {};
  data.message = "this livestream is the best!";
  data.authorimg = remoteWindowURL+"/youtube-live-chat-sample-avatar.png";
  $( "highlight-chat" ).addClass("preview").append('<div class="hl-c-cont fadeout"><div class="hl-name">Sample User<div class="hl-badges"></div></div><div class="hl-message">' + data.message + '</div><div class="hl-img"><img src="' + data.authorimg + '"></div></div>')
  .delay(10).queue(function(next){
    $( ".hl-c-cont" ).removeClass("fadeout");
    next();
  });

  // Restore the popout URL field if they refresh the page
  if(window.location.hash) {
    $("#pop-out-button").click();
  }

});

// Restore settings
var configProperties = ["color","scale","sizeOffset","commentBottom","commentHeight","authorBackgroundColor","authorAvatarBorderColor","authorColor","commentBackgroundColor","commentColor","fontFamily","showOnlyFirstName","highlightWords","popoutURL","autoHideSeconds","authorAvatarOverlayOpacity"];
chrome.storage.sync.get(configProperties, function(item){
  var color = "#000";
  if(item.color) {
    color = item.color;
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
  if(item.authorAvatarOverlayOpacity) {
    root.style.setProperty("--author-avatar-overlay-opacity", item.authorAvatarOverlayOpacity);
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

  if(item.popoutURL) {
    remoteWindowURL = item.popoutURL;
    remoteServerURL = remoteWindowURL + "pub";
  }

  config = item;
});


$("#primary-content").append('<span id="aspect-ratio-container" style="font-size: 0.7em">Aspect Ratio: <span id="aspect-ratio"></span></span>');
$("#primary-content").append('<span id="get-overlay-url-container"><a href="#" id="pop-out-button" class="button">Get Overlay URL</a></span>');
$("#primary-content").append('<span class="hidden"><input type="url" readonly id="pop-out-url"></span>');

function displayAspectRatio() {
  var ratio = Math.round(window.innerWidth / window.innerHeight * 100) / 100;
  ratio += " (target 1.77)";
  $("#aspect-ratio").text(ratio);
}
displayAspectRatio();
window.onresize = displayAspectRatio;

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
  $("#aspect-ratio-container").addClass("hidden");
  $("#get-overlay-url-container").addClass("hidden");
});

$("#pop-out-url").click(function(){
  $(this).select();
});

$(document).keyup(function(e){

    if(e.keyCode === 27) {
      hideActiveChat();
    }

});

$(function(){

  // Restore the popout URL field if they refresh the page
  if(window.location.hash) {
    $("#pop-out-button").click();
  }

  // Show banner
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const params = new URLSearchParams(window.location.search);
  videoID = params.get('v');

  $.post("https://chat.aaronpk.tv/featured.php", {
    lang: window.navigator.language,
    tz: timezone,
    version: version,
    v: videoID
  }, function(response){
    if(response && response.img) {
      var link = 'https://chat.aaronpk.tv/redirect.php?tag='+response.tag+'&lang='+window.navigator.language+'&tz='+timezone+"&version="+version;
      $("body").append('<div id="featured"><a href="'+link+'" target="_blank"><img src="'+response.img+'" height="32" width="160"></a></span>');
    }
  });

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

