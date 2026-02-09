'use client'

import { useState } from 'react'
import { Search, Plus, X, Tv, Loader2, Youtube } from 'lucide-react'

interface Video {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  description: string
}

export default function Home() {
  const [channels, setChannels] = useState<string[]>([''])
  const [searchQuery, setSearchQuery] = useState('')
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addChannel = () => {
    setChannels([...channels, ''])
  }

  const removeChannel = (index: number) => {
    setChannels(channels.filter((_, i) => i !== index))
  }

  const updateChannel = (index: number, value: string) => {
    const newChannels = [...channels]
    newChannels[index] = value
    setChannels(newChannels)
  }

  const searchVideos = async () => {
    setLoading(true)
    setError('')
    setVideos([])

    try {
      const validChannels = channels.filter(ch => ch.trim() !== '')

      if (validChannels.length === 0) {
        setError('Please add at least one channel')
        setLoading(false)
        return
      }

      if (!searchQuery.trim()) {
        setError('Please enter a search query')
        setLoading(false)
        return
      }

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channels: validChannels,
          query: searchQuery,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search videos')
      }

      setVideos(data.videos)
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Tv className="w-12 h-12 text-purple-400 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Reality Show Finder
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            AI-powered video search across your favorite YouTube channels
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl mb-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-purple-300">
              YouTube Channel IDs or Names
            </label>
            {channels.map((channel, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={channel}
                  onChange={(e) => updateChannel(index, e.target.value)}
                  placeholder="e.g., @MrBeast or channel ID"
                  className="flex-1 px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                />
                {channels.length > 1 && (
                  <button
                    onClick={() => removeChannel(index)}
                    className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addChannel}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Channel
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-purple-300">
              Search Query
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., reality show, cooking competition, survival challenge"
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && searchVideos()}
            />
          </div>

          <button
            onClick={searchVideos}
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find Reality Shows
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {videos.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-300">
              Found {videos.length} video{videos.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded flex items-center gap-1">
                      <Youtube className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 text-white">
                      {video.title}
                    </h3>
                    <p className="text-sm text-purple-300 mb-2">
                      {video.channelTitle}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
