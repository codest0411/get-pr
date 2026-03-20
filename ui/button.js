// ============================================================
// ui/button.js — Injects the floating "✨ Draft with AI" button
// ============================================================

// eslint-disable-next-line no-unused-vars
function injectDraftButton() {
  // Don't inject twice
  if (document.querySelector('.getpr-toolbar')) return;

  const isDark = _getprIsDark();

  // ---- Build floating toolbar ----
  const toolbar = document.createElement('div');
  toolbar.className = 'getpr-toolbar' + (isDark ? ' getpr-dark' : '');

  // Tone selector
  const toneSelect = document.createElement('select');
  toneSelect.className = 'getpr-tone-select';
  toneSelect.id = 'getpr-tone';
  toneSelect.innerHTML = `
    <option value="professional">Professional</option>
    <option value="concise">Concise</option>
    <option value="detailed">Detailed</option>
  `;

  // Main button
  const btn = document.createElement('button');
  btn.className = 'getpr-btn';
  btn.id = 'getpr-trigger';
  btn.type = 'button';
  btn.innerHTML = '✨ Draft with AI';

  toolbar.appendChild(toneSelect);
  toolbar.appendChild(btn);

  // ---- Try to place near the textarea, otherwise float ----
  let placed = false;

  // 1. Try PR creation form textarea
  const textarea =
    document.querySelector('#pull_request_body') ||
    document.querySelector('textarea[name="pull_request[body]"]') ||
    document.querySelector('.js-comment-body') ||
    document.querySelector('textarea.comment-form-textarea');

  if (textarea) {
    // Find the write/preview tab bar (best spot)
    const tabNav =
      textarea.closest('.js-previewable-comment-form')?.querySelector('.tabnav-tabs, .UnderlineNav') ||
      textarea.closest('.write-content')?.parentElement?.querySelector('.tabnav-tabs') ||
      textarea.closest('.CommentBox')?.querySelector('.tabnav-tabs, .UnderlineNav');

    if (tabNav) {
      tabNav.style.display = 'flex';
      tabNav.style.alignItems = 'center';
      tabNav.style.justifyContent = 'space-between';
      toolbar.style.position = 'relative';
      toolbar.style.right = 'auto';
      toolbar.style.bottom = 'auto';
      tabNav.appendChild(toolbar);
      placed = true;
    } else {
      // Place above textarea
      const parent = textarea.parentElement;
      if (parent) {
        toolbar.style.position = 'relative';
        toolbar.style.right = 'auto';
        toolbar.style.bottom = 'auto';
        toolbar.style.marginBottom = '8px';
        parent.insertBefore(toolbar, textarea);
        placed = true;
      }
    }
  }

  // 2. Fallback: float as fixed button in bottom-right
  if (!placed) {
    toolbar.classList.add('getpr-toolbar--floating');
    document.body.appendChild(toolbar);
  }

  console.log('[get-PR] Button injected successfully', placed ? '(inline)' : '(floating)');
}

// ---- Helpers ----
function _getprIsDark() {
  const html = document.documentElement;
  return (
    html.getAttribute('data-color-mode') === 'dark' ||
    html.getAttribute('data-dark-theme') === 'dark' ||
    html.classList.contains('dark')
  );
}

function _getprSetButtonLoading(btn) {
  btn.disabled = true;
  btn.classList.add('getpr-btn--loading');
  btn.innerHTML = '<span class="getpr-spinner"></span> Generating…';
}

function _getprSetButtonError(btn, msg) {
  btn.disabled = false;
  btn.classList.remove('getpr-btn--loading');
  btn.classList.add('getpr-btn--error');
  btn.textContent = msg || '⚠ Error — try again';
  setTimeout(() => {
    btn.classList.remove('getpr-btn--error');
    btn.innerHTML = '✨ Regenerate';
  }, 3000);
}

function _getprSetButtonDone(btn) {
  btn.disabled = false;
  btn.classList.remove('getpr-btn--loading');
  btn.classList.add('getpr-btn--success');
  btn.textContent = '✓ Done!';
  setTimeout(() => {
    btn.classList.remove('getpr-btn--success');
    btn.innerHTML = '✨ Regenerate';
  }, 2000);
}
