let LiveChatOverlay = {
  settings: {},
  youtube: {},
  zoom: {},
  pathable: {}
};


LiveChatOverlay.afterInstall = function() {
  $("body").on("click", ".btn-clear", function () {
    $(".hl-c-cont")
      .addClass("fadeout")
      .delay(300)
      .queue(function () {
        $(".hl-c-cont").remove().dequeue();
      });
  });
  createPlaceholderMessage();
  // displayAspectRatio();
}

LiveChatOverlay.setStyle = () => {
  let body = document.body;
  var backgroundColor = "";
  var textColor = "";
  if (
    body.style.getPropertyValue("--yt-live-chat-paid-message-primary-color")
  ) {
    backgroundColor =
      "background-color: " +
      body.style.getPropertyValue(
        "--yt-live-chat-paid-message-primary-color"
      ) +
      ";";
    textColor = "color: #111;";
  }

  if (body.style.getPropertyValue("--yt-live-chat-sponsor-color")) {
    backgroundColor =
      "background-color: " +
      body.style.getPropertyValue("--yt-live-chat-sponsor-color") +
      ";";
    textColor = "color: #111;";
  }
  return `${backgroundColor} ${textColor}`;
}

LiveChatOverlay.renderName = (name, chatbadges) => {
  if (LiveChatOverlay.settings.displayName === 'hidden-name') {
    return '';
  }
  if (LiveChatOverlay.settings.displayName === 'first-name') {
    name = name.split(' ')[0];
  }
  let badges = '';
  if (chatbadges) {
    badges = `<div class="hl-badges">${chatbadges}</div>`
  }
  return `<div class="hl-name">${name}${badges}</div>`
}

LiveChatOverlay.renderChatMessage = (message, name, image, opts) => {
  opts ||= {};
  let imageHTML = image ? `<div class="hl-img"><img src="${image}"></div>` : '';
  // TODO: Cleanup
  let classes = opts.chatbadges || image ? '' : 'no-badges';
  let rendered = `
  <div class="hl-c-cont fadeout">
    ${LiveChatOverlay.renderName(name, opts.chatbadges)}
    <div class="hl-message ${classes}" style="${LiveChatOverlay.setStyle()}">
      ${message}
    </div>
  ${imageHTML}${opts.hasDonation}${opts.hasMembership}
  </div>`;

  displayChatMessage(rendered);
}


function displayChatMessage(message) {
  $("highlight-chat")
  .append(message)
  .delay(10)
  .queue(function (next) {
    $(".hl-c-cont").removeClass("fadeout");
    next();
  });
}

// Show a placeholder message so you can position the window before the chat is live
function createPlaceholderMessage() {
  var chatmessage = "this livestream is the best!";
  var chatimg = "https://pin13.net/youtube-live-chat-sample-avatar.png";
  $("highlight-chat")
    .append(LiveChatOverlay.renderChatMessage(chatmessage, 'Test Message', chatimg, {}))
    .delay(10)
    .queue(function (next) {
      $(".hl-c-cont").removeClass("fadeout");
      next();
    });
}
// Restore settings
var properties = [
  "color",
  "authorBackgroundColor",
  "authorColor",
  "commentBackgroundColor",
  "commentColor",
  "fontFamily",
  "displayName",
  "borderRadius",
  "highlightWords"
];
chrome.storage.sync.get(properties, function (item) {
  var color = "#000";
  if (item.color) {
    color = item.color;
  }

  let root = document.documentElement;
  root.style.setProperty("--keyer-bg-color", color);

  if (item.authorBackgroundColor) {
    root.style.setProperty("--author-bg-color", item.authorBackgroundColor);
    root.style.setProperty(
      "--author-avatar-border-color",
      item.authorBackgroundColor
    );
  }
  if (item.commentBackgroundColor) {
    root.style.setProperty("--comment-bg-color", item.commentBackgroundColor);
  }
  if (item.authorColor) {
    root.style.setProperty("--author-color", item.authorColor);
  }
  if (item.commentColor) {
    root.style.setProperty("--comment-color", item.commentColor);
  }
  if (item.fontFamily) {
    root.style.setProperty("--font-family", item.fontFamily);
  }
  if (item.displayName) {
    root.style.setProperty("--comment-name-display", item.displayName === 'hidden-name' ? 'block' : 'none');
  }
  if (item.borderRadius) {
    root.style.setProperty("--comment-border-radius", `${item.borderRadius}px`);
  }
  LiveChatOverlay.settings.displayName = item.displayName;
  LiveChatOverlay.settings.highlightWords = item.highlightWords;
});

function displayAspectRatio() {
  var ratio = Math.round((window.innerWidth / window.innerHeight) * 100) / 100;
  ratio += " (target 1.77)";
  $("#aspect-ratio").text(ratio);
}

window.onresize = displayAspectRatio;
