/* =============================================
   TAG STORE — script.js
   Unified QR generation + copy to clipboard + toast
   ============================================= */

/* ---- Copy to clipboard ---- */
function copyNumber(text, btn) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(function () {
      showToast();
      markCopied(btn);
    }).catch(function () {
      fallbackCopy(text, btn);
    });
  } else {
    fallbackCopy(text, btn);
  }
}

function fallbackCopy(text, btn) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast();
    markCopied(btn);
  } catch (e) {
    console.warn('Copy failed:', e);
  }
  document.body.removeChild(ta);
}

/* Briefly flip the button to its "copied" (gold-filled) state */
function markCopied(btn) {
  if (!btn) return;
  var original = btn.textContent;
  btn.classList.add('copied');
  btn.textContent = 'Copied ✓';
  clearTimeout(btn._copiedTimer);
  btn._copiedTimer = setTimeout(function () {
    btn.classList.remove('copied');
    btn.textContent = original;
  }, 1600);
}

var toastTimer = null;

function showToast() {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 2200);
}

/* ---- Ripple effect on interactive elements ---- */
function attachRipple(el) {
  el.addEventListener('click', function (e) {
    var rect = el.getBoundingClientRect();
    var ripple = document.createElement('span');
    var size = Math.max(rect.width, rect.height);
    var x = (e.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
    var y = (e.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    el.appendChild(ripple);
    ripple.addEventListener('animationend', function () {
      ripple.remove();
    });
  });
}

/* ---- Unified black/white QR generation ----
   Every code (payment + social) renders with the same
   module colors, size, and quiet zone — the surrounding
   .qr-wrap (white card + gold border) carries the brand
   identity, not the QR pattern itself. */
function renderUnifiedQRCodes() {
  if (typeof QRCode === 'undefined') {
    console.warn('QRCode library not loaded — check qrcode.js include.');
    return;
  }
  var wraps = document.querySelectorAll('.qr-wrap[data-qr-value]');
  wraps.forEach(function (wrap) {
    var value = wrap.getAttribute('data-qr-value');
    if (!value) return;
    new QRCode(wrap, {
      text: value,
      width: 300,
      height: 300,
      colorDark: '#111111',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderUnifiedQRCodes();

  document.querySelectorAll('.copy-btn, .social-link').forEach(function (el) {
    attachRipple(el);
  });
});
