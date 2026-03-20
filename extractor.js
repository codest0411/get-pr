// ============================================================
// extractor.js — Brute-force PR data extraction
// ============================================================

function extractPRData() {
  const url = window.location.href;
  const repoName = url.split('github.com/')[1]?.split('/').slice(0, 2).join('/') || '';

  // 1. Branch Detection (very aggressive)
  let branch = '';
  let baseBranch = '';
  const refSelectors = ['.head-ref', '.base-ref', '.commit-ref', 'span.commit-ref', 'a.commit-ref'];
  document.querySelectorAll(refSelectors.join(',')).forEach(el => {
    const text = el.textContent.trim();
    if (!text) return;
    if (el.classList.contains('head-ref') || el.closest('.head-ref')) branch = text;
    else if (el.classList.contains('base-ref') || el.closest('.base-ref')) baseBranch = text;
  });

  // 2. Title Detection
  const titleEl = document.querySelector('#pull_request_title') || document.querySelector('.js-issue-title') || document.querySelector('[data-testid="issue-title"] h1') || document.querySelector('h1.gh-header-title');
  const title = (titleEl?.value || titleEl?.textContent || '').trim();

  // 3. Commits Detection (Timeline scanning)
  const commits = [];
  const commitSelectors = [
    'a.message',
    '.commit-message',
    '.commit-title',
    '.TimelineItem-body a.Link--primary',
    'code a.Link--primary',
    '.Timeline-Item--condensed a.Link--primary'
  ];
  document.querySelectorAll(commitSelectors.join(',')).forEach(el => {
    const text = el.textContent.trim();
    if (text && text.length > 5 && !commits.includes(text) && !text.includes('merge') && commits.length < 20) {
      commits.push(text);
    }
  });

  // 4. File Detection
  const files = [];
  document.querySelectorAll('.file-header[data-path], [data-file-path], .file-info a[title]').forEach(el => {
    const path = el.getAttribute('data-path') || el.getAttribute('data-file-path') || el.getAttribute('title');
    if (path && !files.includes(path)) files.push(path);
  });

  // 5. File count from Tab bar (critical for public repos)
  let fileCountFromTab = 0;
  const tabCounter = document.querySelector('#files_tab_counter, [data-content="Files changed"] .Counter, a[data-tab-item="files"] .Counter');
  if (tabCounter) fileCountFromTab = parseInt(tabCounter.textContent.replace(/[^0-9]/g, '') || '0', 10);

  // 6. Diff Lines
  const diffLinesArr = [];
  document.querySelectorAll('.blob-code-inner, td.blob-code-inner, .blob-code').forEach(el => {
    if (diffLinesArr.length > 300) return;
    const text = el.textContent.trim();
    if (!text) return;
    let prefix = ' ';
    const p = el.parentElement?.className || '';
    if (p.includes('addition')) prefix = '+';
    else if (p.includes('deletion')) prefix = '-';
    diffLinesArr.push(`${prefix} ${text}`);
  });

  // Status check logic
  let statusMsg = '';
  // If we see zero files but the tab says there are files, we are on the wrong tab
  if (files.length === 0 && diffLinesArr.length === 0 && fileCountFromTab > 0) {
    statusMsg = "FILES_TAB_REQUIRED";
  } else if (fileCountFromTab === 0 && commits.length === 0 && !url.includes('/compare/')) {
    statusMsg = "NO_DATA_FOUND";
  }

  return {
    branch, baseBranch, title, files, commits,
    diffLines: diffLinesArr.join('\n'),
    repoName, statusMsg,
    fileCount: files.length || fileCountFromTab,
    fileTypes: files.map(f => f.split('.').pop())
  };
}
