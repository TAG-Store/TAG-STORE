// ==========================================================================
// TAG STORE — Payment Page Script
// - Copy payment numbers to clipboard
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 1800);
  }

  async function copyNumber(number) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(number);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = number;
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      showToast('Copied');
    } catch (err) {
      showToast('Copy failed');
    }
  }

  document.querySelectorAll('.copy-btn[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const number = btn.getAttribute('data-copy');
      copyNumber(number);
    });
  });

});
