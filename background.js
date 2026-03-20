// ============================================================
// background.js — Ultimate Truly Free AI (Zero Login)
// ============================================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CALL_AI') {
    callAnonymousAI(request.prompt)
      .then(result => {
        console.log('[get-PR] AI Response:', result);
        sendResponse({ success: true, data: result });
      })
      .catch(err => {
        console.error('[get-PR] AI Background Error:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // Keep channel open for async
  }
});

async function callAnonymousAI(userPrompt) {
  // --- Strategy 1: Pollinations (Truly Open & Anonymous) ---
  try {
    console.log('[get-PR] Trying Pollinations.ai (Truly Free)...');
    
    // Build a specific prompt for Pollinations
    const encodedPrompt = encodeURIComponent(
      "Analyze this PR data and return ONLY a single valid JSON object following this EXACT format: " +
      "{ \"title\": \"...\", \"summary\": \"...\", \"type\": \"...\", \"changes\": [\"...\"], \"testingNotes\": \"...\", \"breaking\": [\"...\"], \"reviewFocus\": [\"...\"], \"estimatedReviewTime\": \"...\", \"suggestedLabels\": [\"...\"], \"checklist\": [\"...\"] }. " +
      "PR DATA: " + userPrompt
    );

    // Pollinations for text is open, free, zero keys
    const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=openai&json=true&seed=42`, {
      method: 'GET'
    });

    if (response.ok) {
      const text = await response.text();
      // Remove any non-json noise sometimes returned by Pollinations
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanJson = text.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(cleanJson);
      }
    }
    console.warn('[get-PR] Pollinations failed or returned invalid JSON, trying Puter fallback...');
  } catch (err) {
    console.warn('[get-PR] Pollinations failed:', err.message);
  }

  // --- Strategy 2: Puter AI (Fallback) ---
  try {
    const response = await fetch('https://api.puter.com/drivers/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        interface: 'puter-chat-completion',
        driver: 'gpt-4o-mini',
        method: 'complete',
        args: {
          messages: [
            { role: 'system', content: 'You are a senior engineer. Respond with ONLY valid JSON.' },
            { role: 'user', content: userPrompt }
          ]
        }
      })
    });

    if (response.status === 401) throw new Error('AUTH_REQUIRED');
    if (!response.ok) throw new Error(`Puter HTTP ${response.status}`);

    const data = await response.json();
    let text = '';
    if (data?.result?.message?.content) {
      const content = data.result.message.content;
      text = Array.isArray(content) ? content[0]?.text || content[0] : content;
    } else if (data?.result?.text) {
      text = data.result.text;
    } else if (typeof data?.result === 'string') {
      text = data.result;
    }

    if (!text) throw new Error('Empty response from Puter');
    const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    return JSON.parse(clean);

  } catch (err) {
    throw err;
  }
}
