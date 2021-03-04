/**
*/


function setupWindow() {
  // This is a bit of a hack, but works better once Zoom is fully loaded.
  setTimeout(() => {
    // $('body').wrap(`<div class="zoom-wrapper" style="max-height: ${window.innerHeight/2}; overflow: none">`)
    $("#app").css(
      "max-height",
      "clac(100% - var(--comment-area-height) - 30px)"
    );
    // $("#wc-container-left").css(
    //   "max-height",
    //   "clac(300% - var(--comment-area-height) - 30px)"
    // );
    // $(".main").append(
    //   '<highlight-chat></highlight-chat><button class="btn-clear">CLEAR</button>' +
    //     '<span style="font-size: 0.7em">Aspect Ratio: <span id="aspect-ratio"></span></span>'
    // );
    $("body").append(
      '<highlight-chat></highlight-chat><button class="btn-clear">CLEAR</button>' +
        '<span style="font-size: 0.7em">Aspect Ratio: <span id="aspect-ratio"></span></span>'
    );

    setTimeout(() => { popOutChat() }, 300)
    LiveChatOverlay.afterInstall();
  }, 5);
}

// This is an individual message.
const PATHABLE_CHAT_MESSAGE_SELECTOR = ".message.m-chat";
// Each user's message is within a container, which has their name and avatar.
// Multiple messages can be in one container.
const PATHABLE_CHAT_USER_CONTAINER = '.message .message_body';

// TODO: This is a hack.
window.location.href.indexOf("pathable") > 0 && setupWindow();
window.location.href.indexOf("pathable") > 0 &&
  $("body")
    .unbind("click")
    .on("click", PATHABLE_CHAT_MESSAGE_SELECTOR, function () {
      let $this = $(this);
      let container = $this; /// $this.parentsUntil(PATHABLE_CHAT_USER_CONTAINER);

      $(".hl-c-cont").remove();
      var chatname = container.find("a.name").text();

      var chatmessage = $this.find('.message_body').html();
      // var chatmembership = $this
      //   .find(".yt-live-chat-membership-item-renderer #header-subtext")
      //   .html();
      var useravatar = null;
      let avatar = container.find(".avatar-img");
      if (avatar.length > 0) {
        useravatar = avatar.attr("src");
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

      LiveChatOverlay.renderChatMessage(chatmessage, chatname, useravatar, {
        hasDonation: "",
        hasMembership: "",
        chatbadges: "",
        style: `${backgroundColor} ${textColor}`,
      })
});
