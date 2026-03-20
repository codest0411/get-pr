// ============================================================
// content.js — Main orchestrator for get-PR
// ============================================================

(function () {
  'use strict';

  const RETRY_DELAY = 1500;
  const MAX_INJECT_RETRIES = 5;
  let injectAttempts = 0;

  // ---- Wait for the PR form to be ready, then inject ----
  function tryInject() {
    const textarea =
      document.querySelector('#pull_request_body') ||
      document.querySelector('textarea[name="pull_request[body]"]');

    if (textarea) {
      injectDraftButton();
      attachButtonListener();
      injectAttempts = 0;
      return;
    }

    if (injectAttempts < MAX_INJECT_RETRIES) {
      injectAttempts++;
      setTimeout(tryInject, RETRY_DELAY);
    }
  }

  // ---- Attach click handler to the button ----
  function attachButtonListener() {
    const btn = document.querySelector('#getpr-trigger');
    if (!btn || btn.dataset.listening === 'true') return;
    btn.dataset.listening = 'true';

    btn.addEventListener('click', async () => {
      const tone = document.querySelector('#getpr-tone')?.value || 'professional';

      _getprSetButtonLoading(btn);
      showPanelLoading();

      try {
        // 1. Extract PR data from DOM
        const data = extractPRData();

        if (!data.files.length && !data.diffLines && !data.commits.length) {
          throw new Error('NO_DIFF');
        }

        // 2. Build prompt
        const prompt = buildPrompt(data, tone);

        // 3. Call Claude AI
        const result = await callClaude(prompt);

        // 4. Fill the PR form
        _applyResultToForm(result);

        // 5. Show panel with results
        showPanel(result);

        // 6. Success state
        _getprSetButtonDone(btn);
      } catch (err) {
        console.error('[get-PR] Error:', err);
        hidePanel();

        let msg = '⚠ Error — try again';
        if (err.message === 'NO_DIFF') {
          msg = '⚠ No diff found — add commits first';
        } else if (err.message.includes('Rate limited')) {
          msg = '⏳ Rate limited — wait a moment';
        } else if (err.message.includes('No internet')) {
          msg = '📡 No connection';
        } else if (err.message.includes('invalid JSON')) {
          msg = '⚠ AI response error';
        } else if (err.message.includes('Could not read')) {
          msg = '⚠ Refresh and try again';
        }

        _getprSetButtonError(btn, msg);
      }
    });
  }

  // ---- Handle GitHub SPA navigation ----
  function observeNavigation() {
    // Modern Navigation API (Chromium 102+)
    if (typeof navigation !== 'undefined') {
      navigation.addEventListener('navigatesuccess', () => {
        injectAttempts = 0;
        setTimeout(tryInject, RETRY_DELAY);
      });
    }

    // Fallback: MutationObserver for SPA route changes
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        injectAttempts = 0;
        setTimeout(tryInject, RETRY_DELAY);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also observe for the textarea appearing dynamically
    const formObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (
            node.id === 'pull_request_body' ||
            node.querySelector?.('#pull_request_body')
          ) {
            setTimeout(tryInject, 500);
            return;
          }
        }
      }
    });

    formObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ---- Init ----
  tryInject();
  observeNavigation();
})();
