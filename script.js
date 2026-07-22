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

/* ---- Branded QR generation ----
   Each code still encodes the real payment/social link, but now
   carries a small brand-colored badge in the center so every QR
   is instantly recognizable at a glance — matching what the
   official app-generated codes look like. High error correction
   (H) keeps the code fully scannable with the badge in place. */

var QR_BADGES = {
  'qr-card1': { bg: 'linear-gradient(135deg,#7b2ff7,#f97316)', icon:
    '<span style="font-family:Arial,sans-serif;font-weight:800;font-size:13px;color:#fff;letter-spacing:0.02em;">IP</span>' },
  'qr-card2': { bg: '#e30613', icon:
    '<span style="font-family:Georgia,serif;font-weight:700;font-size:15px;color:#fff;letter-spacing:0;">e&amp;</span>' },
  'qr-card3': { bg: 'linear-gradient(135deg,#7b2ff7,#f97316)', icon:
    '<span style="font-family:Arial,sans-serif;font-weight:800;font-size:13px;color:#fff;letter-spacing:0.02em;">IP</span>' },
  'qr-card4': { bg: '#e60000', icon:
    '<svg viewBox="0 0 24 24" width="60%" height="60%"><path fill="#ffffff" d="M12 5c1.7 0 3 1.3 3 3 0 .6-.2 1.2-.5 1.7 2.6.9 4.5 3.4 4.5 6.3h-2c0-2.5-1.8-4.5-4.2-4.9-.4 1.7-1.9 3-3.8 3-2.2 0-4-1.8-4-4 0-2.1 1.6-3.8 3.6-4-.2-.4-.3-.8-.3-1.1 0-2 1.7-3 3.7-3-.3.9.5 2 1 3z"/></svg>' },
  'qr-tiktok': { bg: '#010101', icon:
    '<svg viewBox="0 0 48 48" width="58%" height="58%"><path fill="#fff" d="M33.5 6c.9 4.6 3.9 7.6 8.5 8v6.4c-3 .3-5.7-.6-8.5-2.2v13.6c0 8.4-9.1 13.7-16.4 9.7-4.8-2.6-6.9-8.5-4.7-13.6 2-4.7 7.4-7.3 12.3-6v6.7c-2.1-.7-4.5.2-5.5 2.2-1.1 2.2-.1 4.9 2.1 6 2.4 1.2 5.3-.2 5.9-2.8.1-.6.2-1.4.2-2.1V6h6.1z"/></svg>' },
  'qr-whatsapp': { bg: '#25d366', icon:
    '<svg viewBox="0 0 48 48" width="58%" height="58%"><path fill="#fff" d="M24 4C13 4 4 13 4 24c0 3.7 1 7.2 2.8 10.2L4 44l10-2.7C16.9 43 20.3 44 24 44c11 0 20-9 20-20S35 4 24 4zm9.4 24.5c-.5.9-2.6 2-3.4 2.4-.9.4-1.9.3-3.1-.2-.7-.3-1.6-.6-2.8-1-4.9-2.2-8.2-7.2-8.4-7.5-.2-.3-2-2.6-2-5s1.3-3.5 1.7-4c.4-.5.9-.6 1.3-.6h.9c.3 0 .7-.1 1.1.8.4.9 1.5 3.3 1.6 3.6.1.3.2.6 0 .9-.2.3-.3.6-.5.9-.2.3-.5.6-.7.9-.2.2-.5.5-.2 1 .3.5 1.2 2.2 2.7 3.5 1.9 1.7 3.5 2.2 4 2.5.5.2.8.2 1.1-.1.3-.3 1.3-1.4 1.6-1.9.3-.6.6-.5 1.1-.3.5.1 3 1.3 3.5 1.6.5.2.8.4 1 .6.1.2.1 1-.4 1.9z"/></svg>' }
};

function addQRBadge(wrap) {
  var badge = QR_BADGES[wrap.id];
  if (!badge) return;
  var holder = document.createElement('div');
  holder.className = 'qr-badge';
  holder.style.background = badge.bg;
  holder.innerHTML = badge.icon;
  wrap.appendChild(holder);
}

function renderUnifiedQRCodes() {
  if (typeof QRCode === 'undefined') {
    console.warn('QRCode library not loaded — check qrcode.js include.');
    return;
  }
  // The "scan to open this page" QR always points to wherever the site is live
  var siteQR = document.getElementById('qr-site');
  if (siteQR) {
    siteQR.setAttribute('data-qr-value', window.location.href);
  }

  var wraps = document.querySelectorAll('.qr-wrap[data-qr-value]');
  wraps.forEach(function (wrap) {
    var value = wrap.getAttribute('data-qr-value');
    if (!value) return;
    new QRCode(wrap, {
      text: value,
      width: 300,
      height: 300,
      colorDark: '#1c1712',
      colorLight: '#f6f0e4',
      correctLevel: QRCode.CorrectLevel.H
    });
    addQRBadge(wrap);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderUnifiedQRCodes();

  var copySiteBtn = document.getElementById('copy-site-link');
  if (copySiteBtn) {
    copySiteBtn.addEventListener('click', function () {
      copyNumber(window.location.href, copySiteBtn);
    });
  }

  document.querySelectorAll('.copy-btn, .social-link').forEach(function (el) {
    attachRipple(el);
  });
});
