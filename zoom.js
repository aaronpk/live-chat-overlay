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

function popOutChat() {
  // Open Chat Action
  $('button.footer-button__button[aria-label="open the chat pane"]').click();
  // Open the chat options menu:
  $('#chatSectionMenu').click();
  // "Pop Out Chat" action. Currently doesn't actually popout the chat...
  // $('#wc-container-right > div > div.chat-header__header > div.dropdown.open.btn-group > ul > li:nth-child(2) > a').click();
}

function setupWindow() {
  // This is a bit of a hack, but works better once Zoom is fully loaded.
  setTimeout(() => {
    // $('body').wrap(`<div class="zoom-wrapper" style="max-height: ${window.innerHeight/2}; overflow: none">`)
    $("#wc-container-right").css('max-height', "clac(100% - var(--comment-area-height) - 30px)");
    $('#wc-container-left').css('max-height', "clac(300% - var(--comment-area-height) - 30px)");
    $(".main").append(
      '<highlight-chat></highlight-chat><button class="btn-clear">CLEAR</button>' +
      '<span style="font-size: 0.7em">Aspect Ratio: <span id="aspect-ratio"></span></span>'
    );
    popOutChat();
  }, 2000)
}

// This is an individual message.
const ZOOM_CHAT_MESSAGE_SELECTOR = '.chat-message-text-content';
// Each user's message is within a container, which has their name and avatar.
// Multiple messages can be in one container.
const ZOOM_CHAT_USER_CONTAINER = '.chat-item__chat-info';

// TODO: This is a hack.
window.location.href.indexOf('zoom') > 0 && setupWindow();
window.location.href.indexOf('zoom') > 0 && $("body")
  .unbind("click")
  .on(
    "click",
    ZOOM_CHAT_MESSAGE_SELECTOR,
    function () {
      let $this = $(this);
      let container = $this.parentsUntil(ZOOM_CHAT_USER_CONTAINER);

      $(".hl-c-cont").remove();
      var chatname = container.find(".chat-item__sender").text();

      var chatmessage = $this.html();
      // var chatmembership = $this
      //   .find(".yt-live-chat-membership-item-renderer #header-subtext")
      //   .html();
      var useravatar = null;
      let avatar = container.find(".chat-item__chat-info-msg-avatar");
      if (avatar.length > 0) {
        useravatar = avatar.attr('src');
      }

      $this.addClass("show-comment");

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

      // TODO: Sponsors don't apply in Zoom?
      if (this.style.getPropertyValue("--yt-live-chat-sponsor-color")) {
        backgroundColor =
          "background-color: " +
          this.style.getPropertyValue("--yt-live-chat-sponsor-color") +
          ";";
        textColor = "color: #111;";
      }

      $("highlight-chat")
        .append(renderChatMessage(chatmessage, chatname, useravatar, {
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

// TODO: These two chunks can be extracted.
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
// TODO: This should be extracted.

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
  if (item.showAuthor) {
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
