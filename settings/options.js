function saveOptions(e) {
  e.preventDefault();
  chrome.storage.sync.set({
    color: document.querySelector("#color").value,
    commentBackgroundColor: document.querySelector("#comment-bg-color").value,
    commentColor: document.querySelector("#comment-color").value,
    authorBackgroundColor: document.querySelector("#author-bg-color").value,
    authorColor: document.querySelector("#author-color").value,
    fontFamily: document.querySelector("#font-family").value,
    showAuthor: document.querySelector("#show-author").checked,
    borderRadius: document.querySelector("#border-radius").value,
  });
}

function restoreOptions() {

  var properties = ["color","authorBackgroundColor","authorColor","commentBackgroundColor","commentColor","fontFamily", "showAuthor", "borderRadius"];
  chrome.storage.sync.get(properties, function(result){
    document.querySelector("#color").value = result.color || "#000";
    document.querySelector("#author-bg-color").value = result.authorBackgroundColor || "#ffa500";
    document.querySelector("#author-color").value = result.authorColor || "#222";
    document.querySelector("#comment-bg-color").value = result.commentBackgroundColor || "#222";
    document.querySelector("#comment-color").value = result.commentColor || "#fff";
    document.querySelector("#font-family").value = result.fontFamily || "Avenir Next, Helvetica, Geneva, Verdana, Arial, sans-serif";
    document.querySelector("#show-author").checked = result.showAuthor;
    document.querySelector("#border-radius").value = result.borderRadius || '0';
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
