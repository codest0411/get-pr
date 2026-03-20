// ============================================================
// content.js — Brute-force orchestrator for get-PR
// ============================================================

(function () {
  'use strict';

  // Debug — confirm script is loading
  console.log('%c[get-PR] ✅ Content script active', 'background: #7c3aed; color: #fff; padding: 2px 5px; border-radius: 3px;');

  const INJECT_INTERVAL = 2000; // 2s watchdog

  // ---- Main Injection Watchdog ----
  function watchdog() {
    try {
      const url = window.location.href;
      // Broad match for any GitHub page that might be a PR/Compare
      const isPR = /\/(pull|pulls|compare)\//.test(url);

      if (!isPR) return;

      // If button is missing, inject it
      if (!document.querySelector('.getpr-toolbar')) {
        injectDraftButton();
        attachButtonListener();
      }
    } catch (e) {
      console.error('[get-PR] Watchdog error:', e);
    }
  }

  // ---- Attach click handler ----
  function attachButtonListener() {
    const btn = document.querySelector('#getpr-trigger');
    if (!btn || btn.dataset.listening === 'true') return;
    btn.dataset.listening = 'true';

    btn.addEventListener('click', async () => {
      const tone = document.querySelector('#getpr-tone')?.value || 'professional';

      _getprSetButtonLoading(btn);
      showPanelLoading();

      try {
        const data = extractPRData();

        if (!data.files.length && !data.diffLines && !data.commits.length) {
          throw new Error('NO_DIFF');
        }

        const prompt = buildPrompt(data, tone);
        const result = await callClaude(prompt);

        _applyResultToForm(result);
        showPanel(result);
        _getprSetButtonDone(btn);
      } catch (err) {
        console.error('[get-PR] Error:', err);
        hidePanel();

        let msg = '⚠ Error';
        if (err.message === 'NO_DIFF') msg = '⚠ No commits';
        else if (err.message.includes('Rate limited')) msg = '⏳ Rate limited';
        else if (err.message.includes('No internet')) msg = '📡 Offline';
        else if (err.message.includes('invalid JSON')) msg = '⚠ AI Error';

        _getprSetButtonError(btn, msg);
      }
    });
  }

  // ---- Start Watchdog ----
  // Initial run
  watchdog();
  // 2s intervals to defeat GitHub SPA navigation
  setInterval(watchdog, INJECT_INTERVAL);

  // Still observe for route changes for instant injection
  if (typeof navigation !== 'undefined') {
    navigation.addEventListener('navigatesuccess', () => {
      document.querySelector('.getpr-toolbar')?.remove();
      watchdog();
    });
  }

  // Cleanup on page unload (optional)
  window.addEventListener('beforeunload', () => {
    document.querySelector('.getpr-toolbar')?.remove();
  });
})();
