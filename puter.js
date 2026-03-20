// ============================================================
// puter.js — FREE Claude AI via Puter (zero API key needed)
// ============================================================

async function callClaude(userPrompt) {
  const MAX_RETRIES = 2;
  let lastError = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch('https://api.puter.com/drivers/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interface: 'puter-chat-completion',
          driver: 'claude-sonnet-4-6',
          test_mode: true,
          method: 'complete',
          args: {
            messages: [
              {
                role: 'system',
                content:
                  'You are a senior software engineer writing PR descriptions. Always respond with ONLY valid JSON. No markdown fences, no explanation, no preamble. Just raw JSON.'
              },
              {
                role: 'user',
                content: userPrompt
              }
            ]
          }
        })
      });

      if (response.status === 429) {
        throw new Error('RATE_LIMITED');
      }

      if (!response.ok) {
        throw new Error(`Puter API call failed: HTTP ${response.status}`);
      }

      const data = await response.json();

      // Navigate safely through response
      let text = '';
      if (data?.result?.message?.content) {
        const content = data.result.message.content;
        if (Array.isArray(content) && content.length > 0) {
          text = content[0].text || content[0];
        } else if (typeof content === 'string') {
          text = content;
        }
      } else if (data?.result?.text) {
        text = data.result.text;
      } else if (typeof data?.result === 'string') {
        text = data.result;
      }

      if (!text) {
        throw new Error('Empty response from AI');
      }

      // Strip accidental markdown fences
      const clean = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

      try {
        return JSON.parse(clean);
      } catch (parseErr) {
        // On last attempt, try to extract JSON from the text
        if (attempt === MAX_RETRIES - 1) {
          const jsonMatch = clean.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          throw new Error('AI returned invalid JSON: ' + clean.substring(0, 200));
        }
        // Otherwise retry
        lastError = parseErr;
        continue;
      }
    } catch (err) {
      lastError = err;

      if (err.message === 'RATE_LIMITED') {
        throw new Error('Rate limited — please try again in a moment.');
      }

      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('No internet connection. Please check your network.');
      }

      // Don't retry on non-recoverable errors
      if (attempt === MAX_RETRIES - 1) {
        throw lastError;
      }

      // Brief wait before retry
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  throw lastError;
}
