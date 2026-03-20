// ============================================================
// content.js — Main orchestrator for get-PR
// ============================================================

(function () {
  'use strict';

  console.log('[get-PR] Content script loaded on:', window.location.href);

  const RETRY_DELAY = 1500;
  const MAX_INJECT_RETRIES = 10;
  let injectAttempts = 0;

  // ---- Wait for the page to stabilize, then inject ----
  function tryInject() {
    // Check if page is a PR page or compare page
    const url = window.location.href;
    const isPR = /github\.com\/[^/]+\/[^/]+\/(pull|compare)/.test(url);

    if (!isPR) {
      console.log('[get-PR] Not a PR page, skipping injection');
      return;
    }

    // Always inject the button — even if textarea isn't found yet
    // The floating fallback ensures it's always visible
    if (!document.querySelector('.getpr-toolbar')) {
      injectDraftButton();
    }

    // If button still doesn't exist and we haven't exceeded retries
    if (!document.querySelector('.getpr-toolbar') && injectAttempts < MAX_INJECT_RETRIES) {
      injectAttempts++;
      console.log(`[get-PR] Retry inject attempt ${injectAttempts}/${MAX_INJECT_RETRIES}`);
      setTimeout(tryInject, RETRY_DELAY);
      return;
    }

    // Attach click handler
    attachButtonListener();
  }

  // ---- Attach click handler to the button ----
  function attachButtonListener() {
    const btn = document.querySelector('#getpr-trigger');
    if (!btn || btn.dataset.listening === 'true') return;
    btn.dataset.listening = 'true';

    console.log('[get-PR] Button listener attached');

    btn.addEventListener('click', async () => {
      const tone = document.querySelector('#getpr-tone')?.value || 'professional';

      _getprSetButtonLoading(btn);
      showPanelLoading();

      try {
        // 1. Extract PR data from DOM
        console.log('[get-PR] Step 1: Extracting PR data...');
        const data = extractPRData();
        console.log('[get-PR] Extracted data:', JSON.stringify(data, null, 2).substring(0, 500));

        if (!data.files.length && !data.diffLines && !data.commits.length) {
          throw new Error('NO_DIFF');
        }

        // 2. Build prompt
        console.log('[get-PR] Step 2: Building prompt...');
        const prompt = buildPrompt(data, tone);

        // 3. Call Claude AI
        console.log('[get-PR] Step 3: Calling Claude AI...');
        const result = await callClaude(prompt);
        console.log('[get-PR] AI result:', JSON.stringify(result).substring(0, 300));

        // 4. Fill the PR form
        console.log('[get-PR] Step 4: Filling form...');
        _applyResultToForm(result);

        // 5. Show panel with results
        showPanel(result);

        // 6. Success state
        _getprSetButtonDone(btn);
        console.log('[get-PR] ✅ Complete!');
      } catch (err) {
        console.error('[get-PR] Error:', err);
        hidePanel();

        let msg = '⚠ Error — try again';
        if (err.message === 'NO_DIFF') {
          msg = '⚠ No diff found';
        } else if (err.message.includes('Rate limited')) {
          msg = '⏳ Rate limited — wait';
        } else if (err.message.includes('No internet')) {
          msg = '📡 No connection';
        } else if (err.message.includes('invalid JSON')) {
          msg = '⚠ AI response error';
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
        console.log('[get-PR] SPA navigation detected (Navigation API)');
        injectAttempts = 0;
        // Remove old toolbar if it exists
        document.querySelector('.getpr-toolbar')?.remove();
        setTimeout(tryInject, RETRY_DELAY);
      });
    }

    // Fallback: watch URL changes
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        console.log('[get-PR] URL changed:', lastUrl, '→', location.href);
        lastUrl = location.href;
        injectAttempts = 0;
        document.querySelector('.getpr-toolbar')?.remove();
        setTimeout(tryInject, RETRY_DELAY);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ---- Init ----
  // Wait a bit for GitHub's dynamic content to load
  setTimeout(tryInject, 1000);
  observeNavigation();
})();
