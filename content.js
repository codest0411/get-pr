// ============================================================
// content.js — Brute-force & Resilient Orchestrator
// ============================================================

(function () {
  'use strict';

  console.log('%c[get-PR] ✅ Active', 'background: #7c3aed; color: #fff; padding: 2px 5px; border-radius: 3px;');

  const INJECT_INTERVAL = 2000;

  function watchdog() {
    try {
      const isPR = /\/(pull|pulls|compare)\//.test(window.location.href);
      if (!isPR) return;
      if (!document.querySelector('.getpr-toolbar')) {
        injectDraftButton();
        attachButtonListener();
      }
    } catch (e) { console.error('[get-PR] Watchdog:', e); }
  }

  function attachButtonListener() {
    const btn = document.querySelector('#getpr-trigger');
    if (!btn || btn.dataset.listening === 'true') return;
    btn.dataset.listening = 'true';

    btn.addEventListener('click', async () => {
      const tone = document.querySelector('#getpr-tone')?.value || 'professional';
      _getprSetButtonLoading(btn);
      showPanelLoading('Analyzing PR data...');

      try {
        const data = extractPRData();

        if (data.statusMsg === 'FILES_TAB_REQUIRED') {
          showPanelError('Switch Tab Required', 'GitHub hides code changes on the current tab. Please click the "Files changed" tab so I can read the diff!');
          throw new Error('FILES_TAB');
        }

        if (data.statusMsg === 'NO_DATA_FOUND') {
          showPanelError('No Data Found', 'I couldn\'t find any commits or file changes on this page. Are you sure this PR has code changes?');
          throw new Error('NO_DATA');
        }

        showPanelLoading('Calling AI (Claude/GPT)...');
        const prompt = buildPrompt(data, tone);
        const result = await callClaude(prompt);

        _applyResultToForm(result);
        showPanel(result);
        _getprSetButtonDone(btn);
      } catch (err) {
        console.error('[get-PR] Error:', err);
        
        let msg = '⚠ Error';
        if (err.message === 'FILES_TAB') {
          msg = '⚠ Switch to "Files changed"';
        } else if (err.message === 'NO_DATA') {
          msg = '⚠ No commits found';
        } else {
          showPanelError('Generation Failed', err.message || 'Something went wrong while talking to the AI.');
          if (err.message.includes('Rate limited')) msg = '⏳ Rate limited';
          else if (err.message.includes('401')) msg = '🔑 Login to Puter';
        }
        
        _getprSetButtonError(btn, msg);
      }
    });
  }

  // Init
  watchdog();
  setInterval(watchdog, INJECT_INTERVAL);

  if (typeof navigation !== 'undefined') {
    navigation.addEventListener('navigatesuccess', () => {
      document.querySelector('.getpr-toolbar')?.remove();
      watchdog();
    });
  }
})();
