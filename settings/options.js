function saveOptions(e) {
  e.preventDefault();
  chrome.storage.sync.set({
    color: document.querySelector("#color").value
  });
}

function restoreOptions() {

  chrome.storage.sync.get("color", function(result){
    document.querySelector("#color").value = result.color || "#000";
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
