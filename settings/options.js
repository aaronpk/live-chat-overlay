function saveOptions(e) {
  e.preventDefault();
  chrome.storage.sync.set({
    color: document.querySelector("#color").value,
    scale: document.querySelector("#scale").value,
    sizeOffset: document.querySelector("#size-offset").value,
    commentBottom: document.querySelector("#comment-bottom").value,
    commentHeight: document.querySelector("#comment-height").value,
    commentBackgroundColor: document.querySelector("#comment-bg-color").value,
    commentColor: document.querySelector("#comment-color").value,
    authorBackgroundColor: document.querySelector("#author-bg-color").value,
    authorAvatarBorderColor: document.querySelector("#author-avatar-border-color").value,
    authorColor: document.querySelector("#author-color").value,
    fontFamily: document.querySelector("#font-family").value,
    highlightWords: document.querySelector("#highlight-words").value.toLowerCase().replace(/[^a-z0-9, ]/gi, '').split(",").map(e => e.trim()),
    showOnlyFirstName: document.querySelector("#firstname").checked,
    autoHideSeconds: document.querySelector("#auto-hide-seconds").value,
    popoutURL: document.querySelector("#popout-url").value
  });
}

function restoreOptions() {

  var properties = ["color","scale","commentBottom","commentHeight","sizeOffset","authorBackgroundColor","authorAvatarBorderColor","authorColor","commentBackgroundColor","commentColor","fontFamily","showOnlyFirstName","highlightWords","popoutURL","autoHideSeconds"];
  chrome.storage.sync.get(properties, function(result){
    document.querySelector("#color").value = result.color || "#000";
    document.querySelector("#scale").value = result.scale || "1.0";
    document.querySelector("#size-offset").value = result.sizeOffset || "0";
    document.querySelector("#comment-bottom").value = result.commentBottom || "10px";
    document.querySelector("#comment-height").value = result.commentHeight || "30vh";
    document.querySelector("#author-bg-color").value = result.authorBackgroundColor || "#ffa500";
    document.querySelector("#author-avatar-border-color").value = result.authorAvatarBorderColor || "#ffa500";
    document.querySelector("#author-color").value = result.authorColor || "#222";
    document.querySelector("#comment-bg-color").value = result.commentBackgroundColor || "#222";
    document.querySelector("#comment-color").value = result.commentColor || "#fff";
    document.querySelector("#font-family").value = result.fontFamily || "Avenir Next, Helvetica, Geneva, Verdana, Arial, sans-serif";
    document.querySelector("#firstname").checked = result.showOnlyFirstName || false;
    document.querySelector("#auto-hide-seconds").value = result.autoHideSeconds || 0;
    document.querySelector("#highlight-words").value = result.highlightWords.join(", ") || "question";
    document.querySelector("#popout-url").value = result.popoutURL || "https://chat.aaronpk.tv/overlay/";
  });

}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
