import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function Videos() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
                console.log('Videos fetched:', data)
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
            </header>

            {videos.length === 0 ? (
                <p>No videos yet.</p>
            ) : (
                <div className="books-grid">
                    {videos.map((video) => (
                        <div key={video.id} className="book-card">
                            <div className="book-name">{video.title}</div>
                            {video.category && <div className="being-aka">{video.category}</div>}
                            {video.description && <p className="book-summary">{video.description}</p>}
                            <p className="book-figures">{video.source_type}: {video.source_url}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default Videos