// ============================================================
// puter.js — FREE Claude AI via Puter (zero API key needed)
// ============================================================

async function callClaude(userPrompt) {
  // Models to try in order
  const MODELS = ['claude-3-5-sonnet', 'gpt-4o-mini'];
  let lastError = null;

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    const isLast = i === MODELS.length - 1;

    try {
      const response = await fetch('https://api.puter.com/drivers/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({
          interface: 'puter-chat-completion',
          driver: model,
          method: 'complete',
          args: {
            messages: [
              {
                role: 'system',
                content: 'You are a senior software engineer. Respond with ONLY valid JSON.'
              },
              {
                role: 'user',
                content: userPrompt
              }
            ]
          }
        })
      });

      if (response.status === 401 && model === 'claude-3-5-sonnet') {
        console.warn('[get-PR] Claude 401, trying fallback...');
        continue;
      }

      if (!response.ok) {
        throw new Error(`Puter API (${model}) failed: HTTP ${response.status}`);
      }

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

      if (!text) throw new Error('Empty response from AI');

      const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

      try {
        return JSON.parse(clean);
      } catch (parseErr) {
        if (isLast) {
          const jsonMatch = clean.match(/\{[\s\S]*\}/);
          if (jsonMatch) return JSON.parse(jsonMatch[0]);
          throw new Error('AI returned invalid JSON');
        }
        lastError = parseErr;
        continue;
      }
    } catch (err) {
      lastError = err;
      if (err.message.includes('RATE_LIMITED')) throw new Error('Rate limited');
      if (err.message.includes('Failed to fetch')) throw new Error('No internet');
      if (isLast) throw lastError;
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw lastError;
}
