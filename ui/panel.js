// ============================================================
// ui/panel.js — Slide-in side panel to display AI output
// ============================================================

let _getprPanelEl = null;
let _getprOverlayEl = null;
let _getprLastResult = null;

function showPanel(result) {
  _getprLastResult = result;

  // Create overlay + panel on first call
  if (!_getprPanelEl) {
    _createPanelDOM();
  }

  _populatePanel(result);

  // Show
  requestAnimationFrame(() => {
    _getprOverlayEl.classList.add('getpr-visible');
    _getprPanelEl.classList.add('getpr-open');
  });
}

function hidePanel() {
  if (_getprPanelEl) _getprPanelEl.classList.remove('getpr-open');
  if (_getprOverlayEl) _getprOverlayEl.classList.remove('getpr-visible');
}

function showPanelError(title, msg) {
  if (!_getprPanelEl) _createPanelDOM();

  const body = _getprPanelEl.querySelector('.getpr-panel-body');
  body.innerHTML = `
    <div style="padding: 24px; text-align: center;">
      <div style="font-size: 40px; margin-bottom: 16px;">🔍</div>
      <h3 style="margin-bottom: 12px; color: var(--gpr-text);">${_esc(title)}</h3>
      <p style="font-size: 13px; color: var(--gpr-text-secondary); line-height: 1.6; margin-bottom: 24px;">
        ${_esc(msg)}
      </p>
      <button onclick="document.querySelector('#getpr-trigger').click();" class="getpr-panel-footer-btn getpr-panel-footer-btn--primary">
        🔄 Try Again
      </button>
    </div>
  `;

  requestAnimationFrame(() => {
    _getprOverlayEl.classList.add('getpr-visible');
    _getprPanelEl.classList.add('getpr-open');
  });
}

function showPanelLoading(statusText = 'Generating PR description...') {
  if (!_getprPanelEl) _createPanelDOM();

  const body = _getprPanelEl.querySelector('.getpr-panel-body');
  body.innerHTML = `
    <div style="padding: 20px 20px 10px; font-size: 13px; font-weight: 600; color: var(--gpr-purple);">
      ✨ ${statusText}
    </div>
    <div class="getpr-skeleton">
      <div class="getpr-skeleton-line"></div>
      <div class="getpr-skeleton-line"></div>
      <div class="getpr-skeleton-line"></div>
      <div class="getpr-skeleton-line"></div>
      <div class="getpr-skeleton-line"></div>
      <div class="getpr-skeleton-line"></div>
      <div class="getpr-skeleton-line"></div>
      <div class="getpr-skeleton-line"></div>
    </div>
  `;

  requestAnimationFrame(() => {
    _getprOverlayEl.classList.add('getpr-visible');
    _getprPanelEl.classList.add('getpr-open');
  });
}

// ---- Internal: create the panel DOM once ----
function _createPanelDOM() {
  const isDark = _getprIsDark();

  // Overlay
  _getprOverlayEl = document.createElement('div');
  _getprOverlayEl.className = 'getpr-panel-overlay';
  _getprOverlayEl.addEventListener('click', hidePanel);
  document.body.appendChild(_getprOverlayEl);

  // Panel
  _getprPanelEl = document.createElement('div');
  _getprPanelEl.className = 'getpr-panel' + (isDark ? ' getpr-dark' : '');
  _getprPanelEl.innerHTML = `
    <div class="getpr-panel-header">
      <div class="getpr-panel-logo">
        <span class="getpr-panel-logo-icon">PR</span>
        <span>get-PR</span>
        <span style="font-size:14px">✨</span>
      </div>
      <button class="getpr-panel-close" title="Close panel">✕</button>
    </div>
    <div class="getpr-panel-body"></div>
    <div class="getpr-panel-footer">
      <button class="getpr-panel-footer-btn" id="getpr-copy-all">📋 Copy All</button>
      <button class="getpr-panel-footer-btn getpr-panel-footer-btn--primary" id="getpr-apply-pr">⚡ Apply to PR</button>
    </div>
  `;

  // Events
  _getprPanelEl.querySelector('.getpr-panel-close').addEventListener('click', hidePanel);
  _getprPanelEl.querySelector('#getpr-copy-all').addEventListener('click', _handleCopyAll);
  _getprPanelEl.querySelector('#getpr-apply-pr').addEventListener('click', _handleApplyToPR);

  document.body.appendChild(_getprPanelEl);
}

// ---- Populate panel with result data ----
function _populatePanel(result) {
  const body = _getprPanelEl.querySelector('.getpr-panel-body');

  const breakingHTML =
    result.breaking && result.breaking.length > 0 && result.breaking[0]
      ? `
      <div class="getpr-section getpr-section--breaking">
        <div class="getpr-section-title">⚠ Breaking Changes</div>
        <div class="getpr-section-content">
          <ul>${result.breaking.map(b => `<li>${_esc(b)}</li>`).join('')}</ul>
        </div>
      </div>`
      : '';

  const labelsHTML =
    result.suggestedLabels && result.suggestedLabels.length
      ? result.suggestedLabels.map(l => `<span class="getpr-badge getpr-badge--label">${_esc(l)}</span>`).join('')
      : '';

  const changesHTML =
    result.changes && result.changes.length
      ? `<ul>${result.changes.map(c => `<li>${_esc(c)}</li>`).join('')}</ul>`
      : '<p>No changes listed.</p>';

  const reviewHTML =
    result.reviewFocus && result.reviewFocus.length
      ? `<ul>${result.reviewFocus.map(r => `<li>${_esc(r)}</li>`).join('')}</ul>`
      : '';

  const checklistHTML =
    result.checklist && result.checklist.length
      ? `<ul class="getpr-checklist">${result.checklist.map(c => `<li>${_esc(c)}</li>`).join('')}</ul>`
      : '';

  body.innerHTML = `
    <div class="getpr-panel-title">${_esc(result.title || 'Untitled')}</div>

    <div class="getpr-badges">
      <span class="getpr-badge getpr-badge--type">${_esc(result.type || 'general')}</span>
      ${result.estimatedReviewTime ? `<span class="getpr-badge getpr-badge--time">⏱ ${_esc(result.estimatedReviewTime)}</span>` : ''}
    </div>

    <div class="getpr-section">
      <div class="getpr-section-title">Summary</div>
      <div class="getpr-section-content">${_esc(result.summary || '')}</div>
    </div>

    <div class="getpr-divider"></div>

    <div class="getpr-section">
      <div class="getpr-section-title">Changes</div>
      <div class="getpr-section-content">${changesHTML}</div>
    </div>

    ${breakingHTML}

    <div class="getpr-divider"></div>

    <div class="getpr-section">
      <div class="getpr-section-title">Testing Notes</div>
      <div class="getpr-section-content">${_esc(result.testingNotes || 'No testing notes provided.')}</div>
    </div>

    <div class="getpr-divider"></div>

    ${reviewHTML ? `
    <div class="getpr-section">
      <div class="getpr-section-title">Review Focus</div>
      <div class="getpr-section-content">${reviewHTML}</div>
    </div>
    ` : ''}

    ${labelsHTML ? `
    <div class="getpr-section">
      <div class="getpr-section-title">Suggested Labels</div>
      <div class="getpr-badges">${labelsHTML}</div>
    </div>
    ` : ''}

    ${checklistHTML ? `
    <div class="getpr-section">
      <div class="getpr-section-title">Checklist</div>
      ${checklistHTML}
    </div>
    ` : ''}
  `;
}

// ---- Format result as markdown ----
function _formatMarkdown(r) {
  let md = '';

  md += `## Summary\n${r.summary || ''}\n\n`;

  if (r.changes && r.changes.length) {
    md += `## Changes\n`;
    r.changes.forEach(c => (md += `- ${c}\n`));
    md += '\n';
  }

  if (r.breaking && r.breaking.length && r.breaking[0]) {
    md += `## ⚠ Breaking Changes\n`;
    r.breaking.forEach(b => (md += `- ${b}\n`));
    md += '\n';
  } else {
    md += `## Breaking Changes\nNone\n\n`;
  }

  md += `## Testing\n${r.testingNotes || 'N/A'}\n\n`;

  if (r.reviewFocus && r.reviewFocus.length) {
    md += `## Review Focus\n`;
    r.reviewFocus.forEach(f => (md += `- ${f}\n`));
    md += '\n';
  }

  if (r.checklist && r.checklist.length) {
    md += `## Checklist\n`;
    r.checklist.forEach(c => (md += `- [ ] ${c}\n`));
    md += '\n';
  }

  return md.trim();
}

// ---- Panel actions ----
function _handleCopyAll() {
  if (!_getprLastResult) return;
  const md = _formatMarkdown(_getprLastResult);
  navigator.clipboard.writeText(md).then(() => {
    _showToast('Copied to clipboard!');
  });
}

function _handleApplyToPR() {
  if (!_getprLastResult) return;
  _applyResultToForm(_getprLastResult);
  _showToast('Applied to PR!');
  setTimeout(hidePanel, 600);
}

function _applyResultToForm(result) {
  // Title
  const titleEl = document.querySelector('#pull_request_title');
  if (titleEl && result.title) {
    titleEl.value = result.title;
    titleEl.dispatchEvent(new Event('input', { bubbles: true }));
    titleEl.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Body
  const bodyEl =
    document.querySelector('#pull_request_body') ||
    document.querySelector('textarea[name="pull_request[body]"]');
  if (bodyEl) {
    bodyEl.value = _formatMarkdown(result);
    bodyEl.dispatchEvent(new Event('input', { bubbles: true }));
    bodyEl.dispatchEvent(new Event('change', { bubbles: true }));
    bodyEl.focus();
  }
}

// ---- Toast notification ----
function _showToast(msg) {
  let toast = document.querySelector('.getpr-copied-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'getpr-copied-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('getpr-show');
  setTimeout(() => toast.classList.remove('getpr-show'), 2000);
}

// ---- Escape HTML ----
function _esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
