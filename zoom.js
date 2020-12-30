/**

<div role="presentation" class="chat-item__chat-info">
  <div class="chat-item__chat-info-header">
    <div class="chat-item__left-container">
      <span
        role="presentation"
        class="chat-item__sender"
        title="Me"
        data-userid="16778240"
        data-name="Me"
      >
        Me
      </span>
      <span class="chat-item__to"> To </span>
      <span
        role="presentation"
        class="chat-item__chat-info-header--can-select chat-item__chat-info-header--everyone"
        title="Everyone"
        data-userid="0"
        data-name="Everyone"
      >
        Everyone
      </span>
      <span
        role="presentation"
        class="hidden chat-item__chat-info-header--can-select chat-item__chat-info-header--everyone"
        title="All panelists"
        data-userid="1"
        data-name="All panelists"
      >
        All panelists
      </span>
    </div>
  </div>
  <pre class="chat-item__chat-info-msg">test</pre>
</div>
*/

function setupWindow() {
  $('button.footer-button__button[aria-label="open the chat pane"]').click();
  setTimeout(() => {
    $("#wc-container-right").css('max-height', window.innerHeight/2).after(
      '<highlight-chat></highlight-chat><button class="btn-clear">CLEAR</button>'
    );
    $('#wc-container-left').css('max-height', window.innerHeight/2);
    $(".main").append(
      '<span style="font-size: 0.7em">Aspect Ratio: <span id="aspect-ratio"></span></span>'
    );
  }, 2000)
}

const ZOOM_CHAT_MESSAGE_SELECTOR = '.chat-item__chat-info';

// TODO: This is a hack.
window.location.href.indexOf('zoom') > 0 && setupWindow();
window.location.href.indexOf('zoom') > 0 && $("body")
  .unbind("click")
  .on(
    "click",
    ZOOM_CHAT_MESSAGE_SELECTOR,
    function () {
      // Public messages have a class with the text "to Everyone"
      // $(this).find('.chat-item__chat-info-header--everyone').lenght == 0

      $(".hl-c-cont").remove();
      var chatname = $(this).find(".chat-item__sender").text();

      // Show just the first name. Comment this out to show the full name.
      chatname = chatname.replace(/ .*/, "");
      var chatmessage = $(this).find(".chat-item__chat-info-msg").html();
      // var chatmembership = $(this)
      //   .find(".yt-live-chat-membership-item-renderer #header-subtext")
      //   .html();
      var chatbadges = "";
      // if (
      //   $(this).find("#chat-badges .yt-live-chat-author-badge-renderer img")
      //     .length > 0
      // ) {
      //   chatbadges = $(this)
      //     .find("#chat-badges .yt-live-chat-author-badge-renderer img")
      //     .parent()
      //     .html();
      // }

      $(this).addClass("show-comment");

      // TODO: Extract this.
      var backgroundColor = "";
      var textColor = "";
      if (
        this.style.getPropertyValue("--yt-live-chat-paid-message-primary-color")
      ) {
        backgroundColor =
          "background-color: " +
          this.style.getPropertyValue(
            "--yt-live-chat-paid-message-primary-color"
          ) +
          ";";
        textColor = "color: #111;";
      }

      // This doesn't work yet
      if (this.style.getPropertyValue("--yt-live-chat-sponsor-color")) {
        backgroundColor =
          "background-color: " +
          this.style.getPropertyValue("--yt-live-chat-sponsor-color") +
          ";";
        textColor = "color: #111;";
      }

      $("highlight-chat")
        .append(renderChatMessage(chatmessage, chatname, null, {
          hasDonation: '',
          hasMembership: '',
          chatbadges: '',
          style: `${backgroundColor} ${textColor}`
        }))
        .delay(10)
        .queue(function (next) {
          $(".hl-c-cont").removeClass("fadeout");
          next();
        });
    }
  );

$("body").on("click", ".btn-clear", function () {
  $(".hl-c-cont")
    .addClass("fadeout")
    .delay(300)
    .queue(function () {
      $(".hl-c-cont").remove().dequeue();
    });
});


function renderChatMessage(message, name, image, opts ) {
  let imageHTML = image ? `<div class="hl-img"><img src="${image}"></div>` : '';
  let nameHTML = name ? `<div class="hl-name">${name}<div class="hl-badges">
  ${opts.chatbadges}</div></div>` : '';
  // TODO: Cleanup
  let classes = opts.chatbadges || image ? '' : 'no-badges';
  return `
  <div class="hl-c-cont fadeout">
    ${nameHTML}
    <div class="hl-message ${classes}" style="${opts.style || ''}">
      ${message}
    </div>
  ${imageHTML}${opts.hasDonation}${opts.hasMembership}
  </div>`;
}

// Show a placeholder message so you can position the window before the chat is live
$(function () {
  var chatmessage = "this livestream is the best!";
  var chatimg = "https://pin13.net/youtube-live-chat-sample-avatar.png";
  $("highlight-chat")
    .append(
      '<div class="hl-c-cont fadeout"><div class="hl-name">Sample User<div class="hl-badges"></div></div><div class="hl-message">' +
        chatmessage +
        '</div><div class="hl-img"><img src="' +
        chatimg +
        '"></div></div>'
    )
    .delay(10)
    .queue(function (next) {
      $(".hl-c-cont").removeClass("fadeout");
      next();
    });
});

// Restore settings

var properties = [
  "color",
  "authorBackgroundColor",
  "authorColor",
  "commentBackgroundColor",
  "commentColor",
  "fontFamily",
  "showAuthor",
  "borderRadius"
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
  if (item.showAuthor != undefined) {
    root.style.setProperty("--comment-name-display", item.showAuthor ? 'block' : 'none');
  }
  if (item.borderRadius) {
    root.style.setProperty("--comment-border-radius", `${item.borderRadius}px`);
  }
});

function displayAspectRatio() {
  var ratio = Math.round((window.innerWidth / window.innerHeight) * 100) / 100;
  ratio += " (target 1.77)";
  $("#aspect-ratio").text(ratio);
}

displayAspectRatio();
window.onresize = displayAspectRatio;
