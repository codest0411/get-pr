// ============================================================
// ui/button.js — Injects the "✨ Draft with AI" floating button
// ============================================================

// eslint-disable-next-line no-unused-vars
function injectDraftButton() {
  // Don't inject twice
  if (document.querySelector('.getpr-toolbar')) return;

  // Find the PR description textarea (creation page or edit)
  const textarea =
    document.querySelector('#pull_request_body') ||
    document.querySelector('.js-comment-body') ||
    document.querySelector('textarea[name="pull_request[body]"]');

  if (!textarea) return;

  // Find a suitable anchor — the toolbar above the textarea
  const anchor =
    textarea.closest('.js-write-bucket')?.parentElement ||
    textarea.closest('.write-content')?.parentElement ||
    textarea.closest('.comment-form-head')?.parentElement ||
    textarea.parentElement;

  if (!anchor) return;

  // Detect dark mode
  const isDark = _getprIsDark();

  // ---- Build toolbar ----
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

  // Insert BEFORE the textarea container
  anchor.insertBefore(toolbar, anchor.firstChild);
}

// Helpers
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
