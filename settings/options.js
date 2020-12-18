function saveOptions(e) {
  e.preventDefault();
  chrome.storage.sync.set({
    color: document.querySelector("#color").value,
    commentBackgroundColor: document.querySelector("#comment-bg-color").value,
    commentColor: document.querySelector("#comment-color").value,
    authorBackgroundColor: document.querySelector("#author-bg-color").value,
    authorColor: document.querySelector("#author-color").value
  });
}

function restoreOptions() {

  chrome.storage.sync.get(["color","authorBackgroundColor","authorColor","commentBackgroundColor","commentColor"], function(result){
    document.querySelector("#color").value = result.color || "#000";
    document.querySelector("#author-bg-color").value = result.authorBackgroundColor || "#ffa500";
    document.querySelector("#author-color").value = result.authorColor || "#222";
    document.querySelector("#comment-bg-color").value = result.commentBackgroundColor || "#222";
    document.querySelector("#comment-color").value = result.commentColor || "#fff";
  });

}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
