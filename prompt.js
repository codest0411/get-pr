// ============================================================
// prompt.js — Builds AI prompt from extracted diff data
// ============================================================

function buildPrompt(data, tone = 'professional') {
  const toneInstructions = {
    professional:
      'Use a professional, clear, and well-structured tone. Be thorough but not overly verbose.',
    concise:
      'Be extremely concise. Use short sentences. Minimize filler words. Keep summary to 1-2 sentences max and changes to 3 bullets max.',
    detailed:
      'Be very detailed and thorough. Explain the reasoning behind changes. Include implementation details, potential edge cases, and full context for reviewers.'
  };

  const toneGuide = toneInstructions[tone] || toneInstructions.professional;

  return `
You are reviewing a GitHub Pull Request. Based on the data below,
generate a COMPLETE, ACCURATE PR description.

TONE: ${toneGuide}

=== PR DATA ===
Repository: ${data.repoName}
Branch: ${data.branch}
Base branch: ${data.baseBranch}
Detected type: ${data.detectedType}
Files changed (${data.files.length} files):
${data.files.slice(0, 20).join('\n')}

File types: ${[...new Set(data.fileTypes)].join(', ')}

Commits:
${data.commits.slice(0, 10).join('\n')}

Stats: +${data.additions} additions, -${data.deletions} deletions

Diff preview (first 300 lines):
${data.diffLines}

=== INSTRUCTIONS ===
Return ONLY this JSON object, nothing else:

{
  "title": "Brief, clear PR title under 72 chars. Start with feat/fix/refactor/docs/chore:",
  "type": "feat | fix | refactor | docs | chore | hotfix",
  "summary": "2-3 sentences explaining WHAT changed and WHY. Be specific.",
  "changes": [
    "Specific change 1 - mention actual function/component names if visible",
    "Specific change 2",
    "Specific change 3 - max 6 bullets total"
  ],
  "breaking": [
    "Breaking change description if any, or empty array if none"
  ],
  "testingNotes": "How to test or verify this PR works correctly",
  "reviewFocus": [
    "Area reviewer should focus on 1",
    "Area reviewer should focus on 2"
  ],
  "suggestedLabels": ["bug", "enhancement", "documentation"],
  "checklist": [
    "Tests added/updated",
    "Documentation updated",
    "No console.log left in code"
  ],
  "estimatedReviewTime": "5 mins | 15 mins | 30 mins | 1 hour"
}
  `.trim();
}
