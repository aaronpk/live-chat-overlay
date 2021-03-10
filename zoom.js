/**
<div role="presentation" class="chat-item__chat-info"><div class="chat-item__chat-info-header"><div class="chat-item__left-container"><span role="presentation" class="chat-item__sender" title="Me" data-userid="16805888" data-name="Me">Me</span><span class="chat-item__to"> To </span><span role="presentation" class="chat-item__chat-info-header--can-select chat-item__chat-info-header--everyone" title="Everyone" data-userid="0" data-name="Everyone">Everyone</span><span role="presentation" class="hidden chat-item__chat-info-header--can-select chat-item__chat-info-header--everyone" title="All panelists" data-userid="1" data-name="All panelists">All panelists</span></div></div><div class="chat-item__chat-info-msg-container"><div class="chat-item__chat-info-msg-avatar-container"><img src="https://lh3.googleusercontent.com/a-/AOh14Gg4V_GckD2rhjxA6qpyHIYzsrf3r-upCqxUAztjCA" alt="" class="chat-item__chat-info-msg-avatar"></div><div class="chat-item__chat-info-msg-text-container"><pre class="chat-item__chat-info-msg"><div class="chat-message-container"><div role="presentation" class="chat-message-text chat-message-text-self"><div class="chat-message-text-content show-comment" id="28-{8E467DD3-E805-0C33-DC08-EE8E2CB3B9A7}">test</div></div><div class="chat-message-options chat-message__chat-option-btn"></div></div></pre></div></div></div>
*/

function popOutChat() {
  // Open Chat Action
  $('button.footer-button__button[aria-label="open the chat pane"]').click();
  // Open the chat options menu:
  $("#chatSectionMenu").click();
  // "Pop Out Chat" action. Currently doesn't actually popout the chat...
  setTimeout(() => {
    $('#wc-container-right > div > div.chat-header__header > div.dropdown.open.btn-group > ul > li:nth-child(2) > a').click();
  }, 2000)
}

function setupWindow() {
  // This is a bit of a hack, but works better once Zoom is fully loaded.
  setTimeout(() => {
    // $('body').wrap(`<div class="zoom-wrapper" style="max-height: ${window.innerHeight/2}; overflow: none">`)
    $("#wc-container-right").css(
      "max-height",
      "calc(100% - var(--comment-area-height) - 30px)"
    );
    $("#wc-container-left").css(
      "max-height",
      "calc(100% - var(--comment-area-height) - 30px)"
    );
    $(".main").append(
      '<highlight-chat></highlight-chat><button class="btn-clear">CLEAR</button>' +
        '<span style="font-size: 0.7em">Aspect Ratio: <span id="aspect-ratio"></span></span>'
    );
    $(".root").append(
      '<highlight-chat></highlight-chat><button class="btn-clear">CLEAR</button>' +
        '<span style="font-size: 0.7em">Aspect Ratio: <span id="aspect-ratio"></span></span>'
    );

    setTimeout(() => { popOutChat() }, 300)
    LiveChatOverlay.afterInstall();
  }, 2500);
}

// This is an individual message.
const ZOOM_CHAT_MESSAGE_SELECTOR = ".chat-message-text-content";
// Each user's message is within a container, which has their name and avatar.
// Multiple messages can be in one container.
const ZOOM_CHAT_USER_CONTAINER = '.chat-item__chat-info';

// TODO: This is a hack.
window.location.href.indexOf("zoom") > 0 && setupWindow();
window.location.href.indexOf("zoom") > 0 &&
  $("body")
    .unbind("click")
    .on("click", ZOOM_CHAT_MESSAGE_SELECTOR, function () {
      let $this = $(this);
      let container = $this.parentsUntil(ZOOM_CHAT_USER_CONTAINER).parent();

      var chatname = container.find(".chat-item__sender").attr('title');
      var chatmessage = $this.html();
      var useravatar = null;
      let avatar = container.find(".chat-item__chat-info-msg-avatar");
      if (avatar.length > 0) {
        useravatar = avatar.attr("src");
      }

      $(".hl-c-cont").remove();
      $this.addClass("show-comment");
      LiveChatOverlay.renderChatMessage(chatmessage, chatname, useravatar);
});
