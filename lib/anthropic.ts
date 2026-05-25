import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface CurationResult {
  article_scores: { article_id: string; relevance_score: number }[]
  suggested_sources: {
    name: string
    url: string
    platform: string
    focus_area: string
    reason: string
  }[]
}

export async function curateContent(
  tasteProfile: { category: string; score: number }[],
  existingSources: { name: string; url: string; platform: string }[],
  articles: { id: string; title: string; excerpt: string; platform: string; source_name: string }[]
): Promise<CurationResult> {
  const systemPrompt = `You are a personal news curator for a tech/AI professional.
Your job is to score articles for relevance and suggest new sources based on user taste.
Always respond with valid JSON only — no markdown, no prose outside the JSON structure.`

  const userMessage = `
TASTE PROFILE (category → score 0-10):
${tasteProfile.map(t => `  ${t.category}: ${t.score}`).join('\n')}

EXISTING SOURCES:
${existingSources.map(s => `  - ${s.name} (${s.platform}) ${s.url}`).join('\n')}

ARTICLES TO SCORE (0.0 = irrelevant, 1.0 = perfect match):
${articles.map(a => `  ID:${a.id} | "${a.title}" | ${a.source_name} (${a.platform})\n  Excerpt: ${a.excerpt?.slice(0, 120) ?? ''}`).join('\n\n')}

Respond with ONLY this JSON structure:
{
  "article_scores": [
    { "article_id": "...", "relevance_score": 0.0 }
  ],
  "suggested_sources": [
    {
      "name": "...",
      "url": "...",
      "platform": "blog|twitter|rss|reddit|arxiv|news",
      "focus_area": "AI Trends|Creative Tech|Tech Art|Generative Design|Real-Time Graphics|Tools & Pipelines",
      "reason": "..."
    }
  ]
}
Suggest 2-3 new sources that are NOT in the existing sources list.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: userMessage }],
    system: systemPrompt,
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return JSON.parse(text) as CurationResult
}
