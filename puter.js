// ============================================================
// puter.js — Bridge to anonymous AI via background worker
// ============================================================

async function callClaude(userPrompt) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'CALL_AI', prompt: userPrompt },
      (response) => {
        if (!response) {
          reject(new Error('Extension context invalidated. Please reload the page.'));
          return;
        }

        if (response.success) {
          resolve(response.data);
        } else {
          // If 401, we'll try to explain why it's failing
          if (response.error.includes('401')) {
            reject(new Error('AUTH_REQUIRED'));
          } else {
            reject(new Error(response.error || 'AI generation failed'));
          }
        }
      }
    );
  });
}
