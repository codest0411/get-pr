// ============================================================
// extractor.js — Reads all PR data from the GitHub DOM
// ============================================================

function extractPRData() {
  const url = window.location.href;
  const urlParts = url.replace('https://github.com/', '').split('/');
  const repoName = urlParts.slice(0, 2).join('/');

  // ---- Branch names ----
  const headRefEl = document.querySelector('.head-ref a, .head-ref');
  let branch = headRefEl ? headRefEl.textContent.trim() : '';

  let baseBranch = '';
  const baseRefEl = document.querySelector('.base-ref a, .base-ref');
  if (baseRefEl) {
    baseBranch = baseRefEl.textContent.trim();
  }

  // Fallback: parse from /compare/ URL  e.g. /compare/main...feature-branch
  if (!branch && url.includes('/compare/')) {
    const comparePart = url.split('/compare/').pop().split('?')[0];
    const parts = comparePart.split('...');
    if (parts.length === 2) {
      baseBranch = baseBranch || parts[0];
      branch = parts[1];
    }
  }

  // ---- PR title (pre-filled on creation page) ----
  const titleEl = document.querySelector('#pull_request_title');
  const title = titleEl ? titleEl.value.trim() : '';

  // ---- Changed files ----
  const fileHeaders = document.querySelectorAll(
    '.file-header[data-path], .file-info [title], .file-header a[title], copilot-diff-entry'
  );
  const files = [];
  fileHeaders.forEach(el => {
    const path =
      el.getAttribute('data-path') ||
      el.getAttribute('title') ||
      el.textContent.trim();
    if (path && !files.includes(path)) files.push(path);
  });

  // Also try alternate selector used on newer GitHub UI
  if (files.length === 0) {
    document.querySelectorAll('[data-file-path]').forEach(el => {
      const p = el.getAttribute('data-file-path');
      if (p && !files.includes(p)) files.push(p);
    });
  }

  // ---- File types ----
  const fileTypes = files.map(f => {
    const ext = f.split('.').pop();
    return ext ? `.${ext}` : 'unknown';
  });

  // ---- Commit messages ----
  const commitEls = document.querySelectorAll(
    '.commit-title, .commit-message, .Timeline-Item--condensed a.Link--primary'
  );
  const commits = [];
  commitEls.forEach(el => {
    const text = el.textContent.trim();
    if (text && !commits.includes(text)) commits.push(text);
  });

  // ---- Diff stats ----
  let additions = 0;
  let deletions = 0;
  const diffstatEl = document.querySelector(
    '#diffstat, .diffstat, .toc-diff-stats, .js-diff-progressive-container'
  );
  if (diffstatEl) {
    const statText = diffstatEl.textContent;
    const addMatch = statText.match(/([\d,]+)\s*addition/);
    const delMatch = statText.match(/([\d,]+)\s*deletion/);
    if (addMatch) additions = parseInt(addMatch[1].replace(/,/g, ''), 10);
    if (delMatch) deletions = parseInt(delMatch[1].replace(/,/g, ''), 10);
  }

  // Fallback: count green/red stat elements
  if (additions === 0 && deletions === 0) {
    const statNumbers = document.querySelectorAll('.diffstat .text-green, .diffstat .text-red, .color-fg-success, .color-fg-danger');
    statNumbers.forEach(el => {
      const num = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
      if (isNaN(num)) return;
      if (el.classList.contains('text-green') || el.classList.contains('color-fg-success')) {
        additions += num;
      } else {
        deletions += num;
      }
    });
  }

  // ---- Diff lines (limit to 300 lines) ----
  const diffLineEls = document.querySelectorAll(
    '.blob-code-inner, .blob-code, td.blob-code'
  );
  const diffLinesArr = [];
  let lineCount = 0;
  const MAX_DIFF_LINES = 300;

  for (const el of diffLineEls) {
    if (lineCount >= MAX_DIFF_LINES) break;
    const parent = el.closest('tr, .blob-code');
    let prefix = ' ';
    if (parent) {
      if (
        parent.classList.contains('blob-code-addition') ||
        parent.classList.contains('addition')
      ) {
        prefix = '+';
      } else if (
        parent.classList.contains('blob-code-deletion') ||
        parent.classList.contains('deletion')
      ) {
        prefix = '-';
      }
    }
    const lineText = el.textContent;
    if (lineText.trim()) {
      diffLinesArr.push(`${prefix} ${lineText}`);
      lineCount++;
    }
  }
  const diffLines = diffLinesArr.join('\n');

  // ---- Detect PR type ----
  const branchLower = branch.toLowerCase();
  let detectedType = 'general';

  if (branchLower.includes('fix/') || branchLower.includes('bug') || branchLower.includes('hotfix')) {
    detectedType = 'bug fix';
  } else if (branchLower.includes('feat/') || branchLower.includes('feature/')) {
    detectedType = 'feature';
  } else if (branchLower.includes('refactor/')) {
    detectedType = 'refactor';
  } else if (branchLower.includes('docs/') || branchLower.includes('doc/')) {
    detectedType = 'docs';
  } else if (files.length > 0 && files.every(f => f.endsWith('.md') || f.endsWith('.txt') || f.endsWith('.rst'))) {
    detectedType = 'docs';
  } else if (files.length > 0 && files.every(f => /\.(test|spec)\.\w+$/.test(f) || f.includes('__tests__'))) {
    detectedType = 'tests';
  }

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
