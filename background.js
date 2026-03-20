// ============================================================
// background.js — Service worker (minimal for Manifest V3)
// ============================================================

// Register the extension — no persistent background needed.
// This file exists as a placeholder for future features like
// context menus, badge updates, or keyboard shortcuts.

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    console.log('[get-PR] Extension installed successfully.');
  } else if (reason === 'update') {
    console.log('[get-PR] Extension updated.');
  }
});
