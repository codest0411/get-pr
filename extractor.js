// ============================================================
// extractor.js — Reads all PR data from the GitHub DOM
// ============================================================

function extractPRData() {
  const url = window.location.href;
  const urlParts = url.replace('https://github.com/', '').split('/');
  const repoName = urlParts.slice(0, 2).join('/');

  // ---- Branch names ----
  let branch = '';
  let baseBranch = '';

  // Try multiple selectors for branch refs (GitHub changes these often)
  const headRefSelectors = [
    '.head-ref a',
    '.head-ref',
    '.commit-ref.head-ref',
    'span.commit-ref:last-of-type',
    '[data-pjax="#repo-content-pjax-container"] .commit-ref:last-child'
  ];
  for (const sel of headRefSelectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) {
      branch = el.textContent.trim();
      break;
    }
  }

  const baseRefSelectors = [
    '.base-ref a',
    '.base-ref',
    '.commit-ref.base-ref',
    'span.commit-ref:first-of-type'
  ];
  for (const sel of baseRefSelectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) {
      baseBranch = el.textContent.trim();
      break;
    }
  }

  // Fallback: parse from URL  e.g. /compare/main...feature-branch
  if (url.includes('/compare/')) {
    const comparePart = url.split('/compare/').pop().split('?')[0];
    const parts = comparePart.split('...');
    if (parts.length === 2) {
      baseBranch = baseBranch || decodeURIComponent(parts[0]);
      branch = branch || decodeURIComponent(parts[1]);
    }
  }

  // ---- PR title ----
  const titleEl =
    document.querySelector('#pull_request_title') ||
    document.querySelector('.js-issue-title') ||
    document.querySelector('[data-testid="issue-title"]') ||
    document.querySelector('bdi.js-issue-title') ||
    document.querySelector('h1.gh-header-title span');
  const title = titleEl ? (titleEl.value || titleEl.textContent || '').trim() : '';

  // ---- Changed files ----
  const files = [];
  const fileSelectors = [
    '.file-header[data-path]',
    '[data-file-path]',
    '.file-info a[title]',
    'copilot-diff-entry',
    '.js-file-header[data-path]',
    '.file a.Link--primary[title]'
  ];
  for (const sel of fileSelectors) {
    document.querySelectorAll(sel).forEach(el => {
      const path =
        el.getAttribute('data-path') ||
        el.getAttribute('data-file-path') ||
        el.getAttribute('title') ||
        el.textContent.trim();
      if (path && path.length < 300 && !files.includes(path)) files.push(path);
    });
    if (files.length > 0) break;
  }

  // ---- File types ----
  const fileTypes = files.map(f => {
    const parts = f.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : 'unknown';
  });

  // ---- Commit messages ----
  const commits = [];
  const commitSelectors = [
    '.commit-title a',
    '.commit-title',
    '.commit-message',
    '.Timeline-Item--condensed a.Link--primary',
    'a.message',
    'li.Box-row a.Link--primary'
  ];
  for (const sel of commitSelectors) {
    document.querySelectorAll(sel).forEach(el => {
      const text = el.textContent.trim();
      if (text && text.length > 3 && !commits.includes(text)) commits.push(text);
    });
    if (commits.length > 0) break;
  }

  // ---- Diff stats ----
  let additions = 0;
  let deletions = 0;

  // Try multiple selectors for stats
  const statSelectors = [
    '#diffstat',
    '.diffstat',
    '.toc-diff-stats',
    '#files_tab_counter',
    '.js-diff-progressive-container'
  ];
  for (const sel of statSelectors) {
    const el = document.querySelector(sel);
    if (el) {
      const text = el.textContent;
      const addMatch = text.match(/([\d,]+)\s*addition/);
      const delMatch = text.match(/([\d,]+)\s*deletion/);
      if (addMatch) additions = parseInt(addMatch[1].replace(/,/g, ''), 10);
      if (delMatch) deletions = parseInt(delMatch[1].replace(/,/g, ''), 10);
      if (additions || deletions) break;
    }
  }

  // Fallback: count colored stat numbers
  if (!additions && !deletions) {
    document.querySelectorAll('.color-fg-success, .color-fg-danger, .text-green, .text-red').forEach(el => {
      const num = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
      if (isNaN(num)) return;
      const classes = el.className || '';
      if (classes.includes('success') || classes.includes('green')) additions += num;
      else if (classes.includes('danger') || classes.includes('red')) deletions += num;
    });
  }

  // ---- Diff lines (limit 300) ----
  const diffLinesArr = [];
  let lineCount = 0;
  const MAX_DIFF_LINES = 300;

  const diffLineSelectors = [
    'td.blob-code-inner',
    '.blob-code-inner',
    'td.blob-code',
    '.blob-code'
  ];

  for (const sel of diffLineSelectors) {
    const els = document.querySelectorAll(sel);
    if (els.length === 0) continue;

    for (const el of els) {
      if (lineCount >= MAX_DIFF_LINES) break;
      const parent = el.closest('tr') || el.closest('.blob-code') || el;
      let prefix = ' ';
      const parentClass = parent.className || '';
      if (parentClass.includes('addition')) prefix = '+';
      else if (parentClass.includes('deletion')) prefix = '-';

      const lineText = el.textContent;
      if (lineText && lineText.trim()) {
        diffLinesArr.push(`${prefix} ${lineText}`);
        lineCount++;
      }
    }
    if (diffLinesArr.length > 0) break;
  }
  const diffLines = diffLinesArr.join('\n');

  // ---- Detect PR type ----
  const branchLower = (branch || '').toLowerCase();
  let detectedType = 'general';

  if (/fix[\/\-]|bug|hotfix/.test(branchLower)) {
    detectedType = 'bug fix';
  } else if (/feat[\/\-]|feature[\/\-]/.test(branchLower)) {
    detectedType = 'feature';
  } else if (/refactor[\/\-]/.test(branchLower)) {
    detectedType = 'refactor';
  } else if (/docs?[\/\-]/.test(branchLower)) {
    detectedType = 'docs';
  } else if (files.length > 0 && files.every(f => /\.(md|txt|rst|doc)$/i.test(f))) {
    detectedType = 'docs';
  } else if (files.length > 0 && files.every(f => /\.(test|spec)\.\w+$/.test(f) || f.includes('__tests__'))) {
    detectedType = 'tests';
  }

  console.log('[get-PR] Extracted:', {
    branch, baseBranch, title,
    filesCount: files.length,
    commitsCount: commits.length,
    additions, deletions,
    diffLinesCount: diffLinesArr.length,
    detectedType, repoName
  });

  return {
    branch,
    baseBranch,
    title,
    files,
    fileTypes,
    commits,
    additions,
    deletions,
    diffLines,
    detectedType,
    repoName
  };
}
