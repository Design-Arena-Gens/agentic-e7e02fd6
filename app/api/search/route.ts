import { NextRequest, NextResponse } from 'next/server'

interface Video {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const { channels, query } = await request.json()

    if (!channels || !Array.isArray(channels) || channels.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one channel' },
        { status: 400 }
      )
    }

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide a search query' },
        { status: 400 }
      )
    }

    // Mock API response with sample reality show data
    // In production, this would call YouTube Data API
    const mockVideos: Video[] = []

    const realityShowTypes = [
      'Cooking Competition',
      'Survival Challenge',
      'Dating Show',
      'Talent Competition',
      'Home Makeover',
      'Business Competition',
      'Adventure Race',
      'Fashion Show'
    ]

    channels.forEach((channel: string, channelIndex: number) => {
      for (let i = 0; i < 4; i++) {
        const showType = realityShowTypes[Math.floor(Math.random() * realityShowTypes.length)]
        const videoId = `demo_${channelIndex}_${i}_${Date.now()}`

        mockVideos.push({
          id: videoId,
          title: `${showType} - ${query} Episode ${i + 1}`,
          thumbnail: `https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
          channelTitle: channel || `Channel ${channelIndex + 1}`,
          publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          description: `Watch this exciting ${showType.toLowerCase()} featuring ${query}. An amazing reality show experience!`
        })
      }
    })

    // Sort by date
    mockVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    // Apply AI-like filtering based on query relevance
    const filteredVideos = mockVideos.filter(video => {
      const searchTerms = query.toLowerCase().split(' ')
      const videoText = (video.title + ' ' + video.description).toLowerCase()
      return searchTerms.some(term => videoText.includes(term))
    })

    return NextResponse.json({
      success: true,
      videos: filteredVideos.slice(0, 12),
      message: 'Note: This is a demo using mock data. In production, integrate YouTube Data API v3 with your API key.'
    })

  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
