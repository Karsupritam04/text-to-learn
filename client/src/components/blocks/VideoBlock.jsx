import { useEffect, useState } from 'react'
import { youtubeApi } from '../../utils/api'

export default function VideoBlock({ block }) {
  const [video, setVideo] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  const query = block?.query || block?.text || 'Educational Lecture'

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    youtubeApi
      .search(query, 1)
      .then((results) => {
        if (cancelled) return
        if (results && results.length > 0 && results[0]?.embedUrl) {
          setVideo(results[0])
          setStatus('ready')
        } else {
          // Graceful fallback to YouTube search embed
          setVideo({
            videoId: 'search-embed',
            title: query,
            embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`,
          })
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Fallback on error as well
          setVideo({
            videoId: 'search-embed',
            title: query,
            embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`,
          })
          setStatus('ready')
        }
      })

    return () => {
      cancelled = true
    }
  }, [query])

  const watchUrl =
    video?.videoId && video.videoId !== 'search-embed'
      ? `https://www.youtube.com/watch?v=${video.videoId}`
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`

  return (
    <div className="my-8 rounded-2xl border border-ink-700/15 bg-white p-5 shadow-xs overflow-hidden">
      {/* Header with YouTube branding & External Watch button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-ink-700/10">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-sm shadow-xs shrink-0">
            ▶
          </span>
          <div className="min-w-0">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-red-600">
              Curated Video Lecture
            </span>
            <h4 className="text-sm font-semibold text-ink-900 truncate">
              {video?.title || query}
            </h4>
          </div>
        </div>

        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-700 hover:text-red-600 bg-paper-50 hover:bg-paper-100 border border-ink-700/15 px-3 py-1.5 rounded-lg transition-colors shrink-0"
        >
          <span>Watch on YouTube</span>
          <span className="text-sm">↗</span>
        </a>
      </div>

      {/* Video Player or Loading State */}
      {status === 'loading' && (
        <div className="aspect-video w-full rounded-xl bg-ink-900/5 flex flex-col items-center justify-center animate-pulse">
          <span className="text-3xl mb-2">🎬</span>
          <p className="text-xs font-medium text-ink-700/70">
            Fetching video lecture for &ldquo;{query}&rdquo;...
          </p>
        </div>
      )}

      {status === 'ready' && video && (
        <div className="aspect-video w-full rounded-xl overflow-hidden border border-ink-700/10 bg-black shadow-inner">
          <iframe
            className="w-full h-full"
            src={video.embedUrl}
            title={video.title || query}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}
