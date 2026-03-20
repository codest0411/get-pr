// ============================================================
// content.js — Auto-Switching Orchestrator
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

      // Check if we should auto-resume after a tab switch
      if (sessionStorage.getItem('getpr_auto_run') === 'true') {
        const data = extractPRData();
        if (data.diffLines || data.files.length > 0) {
          sessionStorage.removeItem('getpr_auto_run');
          document.querySelector('#getpr-trigger')?.click();
        }
      }
    } catch (e) {
      console.error('[get-PR] Watchdog:', e);
    }
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

        // --- Automatic Tab Switch Logic ---
        if (data.statusMsg === 'FILES_TAB_REQUIRED') {
          const filesTab = document.querySelector('#files_tab, a[data-tab-item="files"], .tabnav-tab[href*="files"]');
          if (filesTab) {
            showPanelLoading('Switching to "Files changed" tab...');
            sessionStorage.setItem('getpr_auto_run', 'true');
            filesTab.click();
            return; // Stop here, watchdog will resume
          } else {
            showPanelError('Switch Tab Required', 'I need the "Files changed" tab to read the code, but I couldn\'t click it automatically. Please click it manually!');
            throw new Error('FILES_TAB');
          }
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
          showPanelError('Generation Failed', err.message || 'Connection error');
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
