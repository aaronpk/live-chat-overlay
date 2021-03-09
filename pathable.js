/**
*/


function setupWindow() {
  // This is a bit of a hack, but works better once Zoom is fully loaded.
  setTimeout(() => {
    $("#app").css(
      "max-height",
      "clac(100% - var(--comment-area-height) - 30px)"
    );
    $("body").append(
      '<highlight-chat></highlight-chat><button class="btn-clear">CLEAR</button>' +
        '<span style="font-size: 0.7em">Aspect Ratio: <span id="aspect-ratio"></span></span>'
    );

    LiveChatOverlay.afterInstall();
  }, 2500);
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
      var useravatar = null;
      let avatar = container.find(".avatar-img");
      if (avatar.length > 0) {
        useravatar = avatar.attr("src");
      }

      $this.addClass("show-comment");

      LiveChatOverlay.renderChatMessage(chatmessage, chatname, useravatar, {
        hasDonation: "",
        hasMembership: "",
        chatbadges: ""
      })
});
