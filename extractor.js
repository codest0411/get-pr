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

  const headRefSelectors = ['.head-ref a', '.head-ref', '.commit-ref.head-ref', 'span.commit-ref:last-of-type'];
  for (const sel of headRefSelectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) { branch = el.textContent.trim(); break; }
  }

  const baseRefSelectors = ['.base-ref a', '.base-ref', '.commit-ref.base-ref', 'span.commit-ref:first-of-type'];
  for (const sel of baseRefSelectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) { baseBranch = el.textContent.trim(); break; }
  }

  // Fallback: parse from URL
  if (url.includes('/compare/')) {
    const comparePart = url.split('/compare/').pop().split('?')[0];
    const parts = comparePart.split('...');
    if (parts.length === 2) {
      baseBranch = baseBranch || decodeURIComponent(parts[0]);
      branch = branch || decodeURIComponent(parts[1]);
    }
  }

  // ---- PR title ----
  const titleEl = document.querySelector('#pull_request_title') || document.querySelector('.js-issue-title') || document.querySelector('[data-testid="issue-title"]');
  const title = titleEl ? (titleEl.value || titleEl.textContent || '').trim() : '';

  // ---- Changed files ----
  const files = [];
  const fileSelectors = ['.file-header[data-path]', '[data-file-path]', '.file-info a[title]', 'copilot-diff-entry', '.js-file-header[data-path]'];
  for (const sel of fileSelectors) {
    document.querySelectorAll(sel).forEach(el => {
      const path = el.getAttribute('data-path') || el.getAttribute('data-file-path') || el.getAttribute('title') || el.textContent.trim();
      if (path && path.length < 300 && !files.includes(path)) files.push(path);
    });
    if (files.length > 0) break;
  }

  // Fallback: extract file names from files-tab count
  if (files.length === 0) {
    const filesTabCount = document.querySelector('#files_tab_counter, [data-content="Files changed"] .Counter');
    if (filesTabCount) {
      const count = parseInt(filesTabCount.textContent || '0', 10);
      if (count > 0) { for (let i = 0; i < Math.min(count, 5); i++) files.push(`(File ${i + 1})`); }
    }
  }

  const fileTypes = files.map(f => {
    const parts = f.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : 'unknown';
  });

  // ---- Commit messages ----
  const commits = [];
  const commitSelectors = ['.commit-title a', '.commit-title', '.commit-message', '.Timeline-Item--condensed a.Link--primary', 'a.message'];
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
  const statSelectors = ['#diffstat', '.diffstat', '.toc-diff-stats', '#files_tab_counter'];
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

  // ---- Diff lines (limit 300) ----
  const diffLinesArr = [];
  let lineCount = 0;
  const MAX_DIFF_LINES = 300;
  const diffLineSelectors = ['.blob-code-inner', 'td.blob-code-inner', '.blob-code', '.diff-table tr'];

  for (const sel of diffLineSelectors) {
    const els = document.querySelectorAll(sel);
    if (els.length > 5) {
      for (const el of els) {
        if (lineCount >= MAX_DIFF_LINES) break;
        const text = el.textContent.trim();
        if (!text) continue;
        let prefix = ' ';
        const p = el.parentElement?.className || '';
        const c = el.className || '';
        if (p.includes('addition') || c.includes('addition')) prefix = '+';
        else if (p.includes('deletion') || c.includes('deletion')) prefix = '-';
        diffLinesArr.push(`${prefix} ${text}`);
        lineCount++;
      }
      if (diffLinesArr.length > 10) break;
    }
  }
  const diffLines = diffLinesArr.join('\n');

  // ---- Detect PR type ----
  const branchLower = (branch || '').toLowerCase();
  let detectedType = 'general';
  if (/fix[\/\-]|bug|hotfix/.test(branchLower)) detectedType = 'bug fix';
  else if (/feat[\/\-]|feature[\/\-]/.test(branchLower)) detectedType = 'feature';
  else if (/refactor[\/\-]/.test(branchLower)) detectedType = 'refactor';
  else if (/docs?[\/\-]/.test(branchLower)) detectedType = 'docs';

  // State check
  let statusMsg = '';
  if (files.length === 0 && !diffLines && !url.includes('/compare/')) {
    statusMsg = "PLEASE_OPEN_FILES_TAB";
  }

  return {
    branch, baseBranch, title, files, fileTypes, commits,
    additions, deletions, diffLines, detectedType, repoName, statusMsg
  };
}
