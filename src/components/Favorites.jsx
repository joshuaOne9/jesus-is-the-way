import { BEINGS, CATEGORY_COLORS } from '../data/beings'
import { useFavorites } from '../hooks/useFavorites'

function Favorites({ user }) {
    const { favorites, loading, toggleFavorite } = useFavorites(user)

    if (!user) {
        return (
            <section className="page">
                <header className="page-header">
                    <p className="page-eyebrow">Account</p>
                    <h1>My Favorites</h1>
                    <div className="page-divider"></div>
                </header>
                <p>Sign in to save and view your favorites.</p>
            </section>
        )
    }

    if (loading) {
        return <section className="page"><p>Loading favorites...</p></section>
    }

    // Resolve favorited beings (which store just the name) to their full data
    const beingFavorites = favorites
        .filter((f) => f.item_type === 'being')
        .map((f) => BEINGS.find((b) => b.name === f.item_id))
        .filter(Boolean)

    return (
        <section className="page">
            <header className="page-header">
                <p className="page-eyebrow">Account</p>
                <h1>My Favorites</h1>
                <div className="page-divider"></div>
                <p className="page-intro">Everything you've saved.</p>
            </header>

            {favorites.length === 0 ? (
                <p>You haven't saved anything yet. Tap the heart on any being to save it.</p>
            ) : (
                <>
                    <h2 className="fav-section-title">Beings ({beingFavorites.length})</h2>
                    <div className="books-grid">
                        {beingFavorites.map((being) => (
                            <div key={being.name} className="book-card">
                                <div className="book-card-top">
                                    <span
                                        className="book-chapters"
                                        style={{ background: CATEGORY_COLORS[being.category] }}
                                    >
                                        {being.category}
                                    </span>
                                    <button
                                        className="fav-btn"
                                        onClick={() => toggleFavorite('being', being.name)}
                                        aria-label="Remove favorite"
                                    >
                                        ♥
                                    </button>
                                </div>
                                <div className="book-name">{being.name}</div>
                                {being.aka && being.aka.length > 0 && (
                                    <div className="being-aka">{being.aka.join(' · ')}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    )
}

export default Favorites