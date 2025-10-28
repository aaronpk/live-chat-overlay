// Helper function to normalize color values for color inputs
function normalizeColorValue(color) {
  if (!color || color === 'transparent') return '#000000';
  // If it's a 3-digit hex, expand it to 6 digits
  if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
    return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  // If it's already 6 digits, return as is
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return color;
  }
  // Default fallback
  return '#000000';
}

// Default settings
var DEFAULT_SETTINGS = {
  color: "#000",
  scale: "1.0",
  sizeOffset: "0",
  commentBottom: "10px",
  commentHeight: "30vh",
  commentBackgroundColor: "#222",
  commentBackgroundGradient: "",
  commentBoxShadow: "",
  commentColor: "#fff",
  authorBackgroundColor: "#ffa500",
  authorAvatarBorderColor: "#ffa500",
  authorAvatarOverlayOpacity: "0.1",
  authorColor: "#222",
  fontFamily: "Avenir Next, Helvetica, Geneva, Verdana, Arial, sans-serif",
  highlightWords: ["q", "question"],
  showOnlyFirstName: false,
  fullpageMode: false,
  autoHideSeconds: "0",
  popoutURL: "https://chat.aaronpk.tv/overlay/",
  serverURL: "https://chat.aaronpk.tv/overlay/pub",
  persistentSessionID: false,
  sessionID: ""
};

function generateSessionID(){
  var text = "";
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  for (var i = 0; i < 10; i++){
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
};

function toggleSessionID() {
  if (this.checked) {
     document.querySelector("#session-id").value = generateSessionID();
  } else {
     document.querySelector("#session-id").value = "";
  }
}


// Toggle section collapse
function toggleSection(header) {
  var section = header.parentElement;
  section.classList.toggle('collapsed');
}

// Show save indicator
function showSaveIndicator() {
  var indicator = document.getElementById('save-indicator');
  if (indicator) {
    indicator.classList.add('show');
    setTimeout(function() {
      indicator.classList.remove('show');
    }, 3000);
  }
}

// Update slider background gradient dynamically
function updateSliderBackground(slider) {
  var min = slider.min || 0;
  var max = slider.max || 100;
  var value = slider.value;
  var percentage = ((value - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--border) ${percentage}%, var(--border) 100%)`;
}

function saveOptions(e) {
  e.preventDefault();
  // Compose unit fields
  var bottomNumber = document.querySelector("#comment-bottom-number");
  var bottomUnit = document.querySelector("#comment-bottom-unit");
  var heightNumber = document.querySelector("#comment-height-number");
  var heightUnit = document.querySelector("#comment-height-unit");

  var commentBottomComposed = bottomNumber ? (bottomNumber.value + bottomUnit.value) : document.querySelector("#comment-bottom").value;
  var commentHeightComposed = heightNumber ? (heightNumber.value + heightUnit.value) : document.querySelector("#comment-height").value;

  // Background color logic (transparent vs picker)
  var transparentBg = document.querySelector("#transparent-bg");
  var bgValue = transparentBg && transparentBg.checked ? "transparent" : document.querySelector("#color").value;

  chrome.storage.sync.set({
    color: bgValue,
    scale: document.querySelector("#scale").value,
    sizeOffset: document.querySelector("#size-offset").value,
    commentBottom: commentBottomComposed,
    commentHeight: commentHeightComposed,
    commentBackgroundColor: document.querySelector("#comment-bg-color").value,
    commentBackgroundGradient: document.querySelector("#comment-bg-gradient").value,
    commentBoxShadow: document.querySelector("#comment-box-shadow").value,
    commentColor: document.querySelector("#comment-color").value,
    authorBackgroundColor: document.querySelector("#author-bg-color").value,
    authorAvatarBorderColor: document.querySelector("#author-avatar-border-color").value,
    authorAvatarOverlayOpacity: document.querySelector("#author-avatar-overlay-opacity").value,
    authorColor: document.querySelector("#author-color").value,
    fontFamily: document.querySelector("#font-family").value,
    highlightWords: document.querySelector("#highlight-words").value.toLowerCase().replace(/[^a-z0-9, ]/gi, '').split(",").map(e => e.trim()),
    showOnlyFirstName: document.querySelector("#firstname").checked,
    fullpageMode: document.querySelector("#fullpage-mode").checked,
    autoHideSeconds: document.querySelector("#auto-hide-seconds").value,
    popoutURL: document.querySelector("#popout-url").value,
    serverURL: document.querySelector("#server-url").value,
    persistentSessionID: document.querySelector("#persistent-session-id").checked,
    sessionID: document.querySelector("#session-id").value
  }, function() {
    // Show save indicator on successful save
    showSaveIndicator();
  });
}

function restoreOptions() {

  var properties = ["color","scale","commentBottom","commentHeight","sizeOffset","authorBackgroundColor","authorAvatarBorderColor","authorColor","commentBackgroundColor","commentBackgroundGradient","commentBoxShadow","commentColor","fontFamily","showOnlyFirstName","fullpageMode","highlightWords","popoutURL","serverURL","autoHideSeconds","authorAvatarOverlayOpacity","persistentSessionID","sessionID"];
  chrome.storage.sync.get(properties, function(result){
    var colorInput = document.querySelector("#color");
    var colorPicker = document.querySelector("#color-picker");
    var transparentBg = document.querySelector("#transparent-bg");
    var initialColor = result.color || "#000";
    colorInput.value = initialColor;
    if (initialColor === "transparent") {
      transparentBg.checked = true;
      colorPicker.value = "#000000";
    } else {
      transparentBg.checked = false;
      colorPicker.value = normalizeColorValue(initialColor);
    }

    var scaleInput = document.querySelector("#scale");
    scaleInput.value = result.scale || "1.0";
    var scaleValue = document.querySelector("#scale-value");
    if (scaleValue) scaleValue.textContent = parseFloat(scaleInput.value).toFixed(2);

    document.querySelector("#size-offset").value = result.sizeOffset || "0";

    // Decompose bottom and height values
    var bottom = result.commentBottom || "10px";
    var height = result.commentHeight || "30vh";
    document.querySelector("#comment-bottom").value = bottom;
    document.querySelector("#comment-height").value = height;
    var bottomMatch = (bottom+"").match(/(-?\d*\.?\d+)([a-z%]+)/i);
    var heightMatch = (height+"").match(/(-?\d*\.?\d+)([a-z%]+)/i);
    if (bottomMatch) {
      var bottomNumber = document.querySelector("#comment-bottom-number");
      var bottomUnit = document.querySelector("#comment-bottom-unit");
      if (bottomNumber) bottomNumber.value = bottomMatch[1];
      if (bottomUnit) bottomUnit.value = bottomMatch[2];
    }
    if (heightMatch) {
      var heightNumber = document.querySelector("#comment-height-number");
      var heightUnit = document.querySelector("#comment-height-unit");
      if (heightNumber) heightNumber.value = heightMatch[1];
      if (heightUnit) heightUnit.value = heightMatch[2];
    }

    document.querySelector("#author-bg-color").value = normalizeColorValue(result.authorBackgroundColor || "#ffa500");
    document.querySelector("#author-avatar-border-color").value = normalizeColorValue(result.authorAvatarBorderColor || "#ffa500");
    var overlay = document.querySelector("#author-avatar-overlay-opacity");
    overlay.value = result.authorAvatarOverlayOpacity || "0.1";
    var overlayValue = document.querySelector("#author-avatar-overlay-opacity-value");
    if (overlayValue) overlayValue.textContent = parseFloat(overlay.value).toFixed(2);

    document.querySelector("#author-color").value = normalizeColorValue(result.authorColor || "#222");
    document.querySelector("#comment-bg-color").value = normalizeColorValue(result.commentBackgroundColor || "#222");
    document.querySelector("#comment-bg-gradient").value = result.commentBackgroundGradient || "";
    document.querySelector("#comment-box-shadow").value = result.commentBoxShadow || "";
    document.querySelector("#comment-color").value = normalizeColorValue(result.commentColor || "#fff");

    var fontText = document.querySelector("#font-family");
    var fontSelect = document.querySelector("#font-family-select");
    fontText.value = result.fontFamily || "Avenir Next, Helvetica, Geneva, Verdana, Arial, sans-serif";
    var presetOption = Array.from(fontSelect.options).find(o => o.value === fontText.value);
    fontSelect.value = presetOption ? presetOption.value : "custom";

    document.querySelector("#firstname").checked = result.showOnlyFirstName || false;
    document.querySelector("#fullpage-mode").checked = result.fullpageMode || false;
    var autoHide = document.querySelector("#auto-hide-seconds");
    autoHide.value = (result.autoHideSeconds === undefined ? 0 : result.autoHideSeconds);
    var autoHideValue = document.querySelector("#auto-hide-seconds-value");
    if (autoHideValue) autoHideValue.textContent = autoHide.value + "s";
    document.querySelector("#highlight-words").value = result.highlightWords.join(", ") || "q, question";
    document.querySelector("#popout-url").value = result.popoutURL || "https://chat.aaronpk.tv/overlay/";
    document.querySelector("#server-url").value = result.serverURL || "https://chat.aaronpk.tv/overlay/pub";
    document.querySelector("#persistent-session-id").checked = result.persistentSessionID || false;
    document.querySelector("#session-id").value = result.sessionID || "";
  });

  document.querySelector("#persistent-session-id").addEventListener("change", toggleSessionID);

  // Live UI bindings
  var colorPicker = document.querySelector("#color-picker");
  var colorText = document.querySelector("#color");
  var transparentBg = document.querySelector("#transparent-bg");
  if (colorPicker && colorText) {
    colorPicker.addEventListener("input", function(){
      if (transparentBg && transparentBg.checked) return;
      colorText.value = this.value;
    });
  }
  if (transparentBg && colorText) {
    transparentBg.addEventListener("change", function(){
      if (this.checked) {
        colorText.value = "transparent";
      } else if (colorPicker) {
        colorText.value = colorPicker.value;
      }
    });
  }

  var overlay = document.querySelector("#author-avatar-overlay-opacity");
  var overlayValue = document.querySelector("#author-avatar-overlay-opacity-value");
  if (overlay && overlayValue) {
    overlay.addEventListener("input", function(){ 
      overlayValue.textContent = parseFloat(this.value).toFixed(2);
      updateSliderBackground(this);
    });
    updateSliderBackground(overlay);
  }

  var scaleInput = document.querySelector("#scale");
  var scaleValue = document.querySelector("#scale-value");
  if (scaleInput && scaleValue) {
    scaleInput.addEventListener("input", function(){ 
      scaleValue.textContent = parseFloat(this.value).toFixed(2);
      updateSliderBackground(this);
    });
    updateSliderBackground(scaleInput);
  }

  var autoHide = document.querySelector("#auto-hide-seconds");
  var autoHideValue = document.querySelector("#auto-hide-seconds-value");
  if (autoHide && autoHideValue) {
    autoHide.addEventListener("input", function(){ 
      autoHideValue.textContent = this.value + "s";
      updateSliderBackground(this);
    });
    updateSliderBackground(autoHide);
  }

  var fontSelect = document.querySelector("#font-family-select");
  var fontText = document.querySelector("#font-family");
  if (fontSelect && fontText) {
    fontSelect.addEventListener("change", function(){
      if (this.value === "custom") {
        fontText.focus();
        return;
      }
      fontText.value = this.value;
    });
    fontText.addEventListener("input", function(){
      if (this.value && this.value !== fontSelect.value) {
        fontSelect.value = "custom";
      }
    });
  }

  // Add live preview updates for color pickers
  var allColorInputs = document.querySelectorAll('input[type="color"]');
  allColorInputs.forEach(function(input) {
    input.addEventListener("input", function() {
      // Add a subtle pulse effect on color change
      this.style.transform = "scale(1.1)";
      setTimeout(function(el) {
        el.style.transform = "scale(1)";
      }, 150, this);
    });
  });
}

// Reset to defaults
function resetToDefaults() {
  chrome.storage.sync.set(DEFAULT_SETTINGS, function() {
    // Close modal
    closeResetModal();
    // Reload the form with default values
    restoreOptions();
    // Show success indicator
    var indicator = document.getElementById('save-indicator');
    if (indicator) {
      var textSpan = indicator.querySelector('span:last-child');
      if (textSpan) textSpan.textContent = 'Settings reset to defaults!';
      indicator.classList.add('show');
      setTimeout(function() {
        indicator.classList.remove('show');
        if (textSpan) textSpan.textContent = 'Settings saved successfully!';
      }, 3000);
    }
  });
}

// Modal handlers
function showResetModal() {
  var modal = document.getElementById('reset-modal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeResetModal() {
  var modal = document.getElementById('reset-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

document.addEventListener("DOMContentLoaded", function() {
  restoreOptions();
  
  // Bind section header toggles (replaces inline onclick for CSP compliance)
  var sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(function(header){
    header.addEventListener('click', function(){
      toggleSection(this);
    });
  });

  // Tabs behavior
  var tabs = document.querySelectorAll('.tab-button');
  var sections = document.querySelectorAll('.container.tabbed .section');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var target = this.getAttribute('data-tab');
      tabs.forEach(function(t){ t.classList.remove('active'); });
      this.classList.add('active');
      sections.forEach(function(sec){
        if (sec.getAttribute('data-tab') === target) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });
    });
  });
  
  // Reset button handler
  var resetButton = document.getElementById('reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', showResetModal);
  }
  
  // Modal button handlers
  var cancelButton = document.getElementById('cancel-reset');
  if (cancelButton) {
    cancelButton.addEventListener('click', closeResetModal);
  }
  
  var confirmButton = document.getElementById('confirm-reset');
  if (confirmButton) {
    confirmButton.addEventListener('click', resetToDefaults);
  }
  
  // Close modal when clicking overlay
  var modalOverlay = document.getElementById('reset-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        closeResetModal();
      }
    });
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeResetModal();
    }
  });
});

document.querySelector("form").addEventListener("submit", saveOptions);
