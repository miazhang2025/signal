export interface TweetItem {
  title: string
  link: string
  excerpt: string
  image_url: string | null
  published_at: string
  author_handle: string
}

export async function fetchTwitterTimeline(username: string): Promise<TweetItem[]> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN
  if (!bearerToken) {
    console.warn('[Twitter] No bearer token configured')
    return []
  }

  try {
    // Look up the user id first
    const userRes = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=name`,
      { headers: { Authorization: `Bearer ${bearerToken}` } }
    )
    if (!userRes.ok) throw new Error(`User lookup failed: ${userRes.status}`)
    const userData = await userRes.json()
    const userId = userData.data?.id
    if (!userId) return []

    // Fetch recent tweets
    const tweetsRes = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?` +
        new URLSearchParams({
          max_results: '10',
          'tweet.fields': 'created_at,text,attachments',
          'media.fields': 'url,preview_image_url',
          expansions: 'attachments.media_keys',
        }),
      { headers: { Authorization: `Bearer ${bearerToken}` } }
    )
    if (!tweetsRes.ok) throw new Error(`Tweets fetch failed: ${tweetsRes.status}`)
    const tweetsData = await tweetsRes.json()

    const mediaMap: Record<string, string> = {}
    for (const media of tweetsData.includes?.media ?? []) {
      mediaMap[media.media_key] = media.url ?? media.preview_image_url ?? ''
    }

    return (tweetsData.data ?? []).map((tweet: { id: string; text: string; created_at: string; attachments?: { media_keys?: string[] } }) => {
      const mediaKey = tweet.attachments?.media_keys?.[0]
      return {
        title: tweet.text.slice(0, 120),
        link: `https://twitter.com/${username}/status/${tweet.id}`,
        excerpt: tweet.text,
        image_url: mediaKey ? mediaMap[mediaKey] : null,
        published_at: tweet.created_at,
        author_handle: `@${username}`,
      }
    })
  } catch (err) {
    console.error('[Twitter] Failed for', username, err)
    return []
  }
}
