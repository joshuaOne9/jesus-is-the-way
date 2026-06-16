import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useFavorites } from '../hooks/useFavorites'

function getYouTubeEmbedUrl(url) {
    try {
        const parsed = new URL(url)
        let videoId = null

        if (parsed.hostname.includes('youtu.be')) {
            videoId = parsed.pathname.slice(1)
        } else if (parsed.pathname.startsWith('/embed/')) {
            videoId = parsed.pathname.split('/embed/')[1]
        } else if (parsed.pathname.startsWith('/shorts/')) {
            videoId = parsed.pathname.split('/shorts/')[1]
        } else {
            videoId = parsed.searchParams.get('v')
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    } catch {
        return null
    }
}

function Videos({ user }) {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { isFavorited, toggleFavorite } = useFavorites(user)

    useEffect(() => {
        async function fetchVideos() {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching videos:', error)
                setError(error.message)
            } else {
                setVideos(data)
            }
            setLoading(false)
        }

        fetchVideos()
    }, [])

    if (loading) {
        return <section className="page"><p>Loading videos...</p></section>
    }

    if (error) {
        return <section className="page"><p>Couldn't load videos: {error}</p></section>
    }

    return (
        <section className="page videos">
            <header className="page-header">
                <p className="page-eyebrow">Watch</p>
                <h1>Videos</h1>
                <div className="page-divider"></div>
                <p className="page-intro">Deliverance, teaching, and testimony.</p>
            </header>

            {videos.length === 0 ? (
                <p>No videos yet.</p>
            ) : (
                <div className="videos-grid">
                    {videos.map((video) => {
                        const embedUrl =
                            video.source_type === 'link'
                                ? getYouTubeEmbedUrl(video.source_url)
                                : null

                        return (
                            <div key={video.id} className="video-card">
                                <div className="video-player">
                                    {video.source_type === 'link' && embedUrl && (
                                        <iframe
                                            src={embedUrl}
                                            title={video.title}
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    )}

                                    {video.source_type === 'link' && !embedUrl && (
                                        <p className="video-fallback">
                                            Couldn't load this video.{' '}
                                            <a href={video.source_url} target="_blank" rel="noopener noreferrer">
                                                Open it directly
                                            </a>.
                                        </p>
                                    )}

                                    {video.source_type === 'file' && (
                                        <video controls preload="metadata" src={video.source_url}>
                                            Your browser doesn't support video playback.
                                        </video>
                                    )}
                                </div>

                                <div className="video-info">
                                    <div className="video-title-row">
                                        <h2 className="video-title">{video.title}</h2>
                                        {user && (
                                            <button
                                                className={isFavorited('video', video.id) ? 'fav-btn fav-active' : 'fav-btn'}
                                                onClick={() => toggleFavorite('video', video.id)}
                                                aria-label="Toggle favorite"
                                            >
                                                ✝
                                            </button>
                                        )}
                                    </div>
                                    {video.category && <span className="video-category">{video.category}</span>}
                                    {video.description && <p className="video-description">{video.description}</p>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export default Videos