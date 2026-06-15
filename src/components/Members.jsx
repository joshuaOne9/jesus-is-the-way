import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function Members() {
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadProfiles() {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, display_name, bio')
                .not('display_name', 'is', null)
                .order('created_at', { ascending: false })

            if (error) setError(error.message)
            else setProfiles(data)
            setLoading(false)
        }

        loadProfiles()
    }, [])

    if (loading) return <section className="page"><p>Loading members...</p></section>
    if (error) return <section className="page"><p>Couldn't load members: {error}</p></section>

    return (
        <section className="page">
            <header className="page-header">
                <p className="page-eyebrow">Community</p>
                <h1>Members</h1>
                <div className="page-divider"></div>
                <p className="page-intro">Believers walking this path together.</p>
            </header>

            {profiles.length === 0 ? (
                <p>No members have set up a profile yet. Be the first!</p>
            ) : (
                <div className="books-grid">
                    {profiles.map((profile) => (
                        <div key={profile.id} className="book-card">
                            <div className="book-name">{profile.display_name}</div>
                            {profile.bio && <p className="book-summary">{profile.bio}</p>}
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default Members