import { useState, useEffect, useRef } from 'react'
import { BEINGS, CATEGORIES, CATEGORY_COLORS } from '../data/beings'
import RealmGraph from './RealmGraph'

function Beings() {
    const [category, setCategory] = useState('All')
    const [activeBeing, setActiveBeing] = useState(null)
    const [viewMode, setViewMode] = useState('cards')

    const detailPanelRef = useRef(null)

    useEffect(() => {
        if (activeBeing && viewMode === 'graph' && detailPanelRef.current) {
            detailPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [activeBeing, viewMode])

    const filtered = category === 'All'
        ? BEINGS
        : BEINGS.filter((being) => being.category === category)

    return (
        <section className="page beings">
            <header className="page-header">
                <p className="page-eyebrow">Cosmology</p>
                <h1> The Spiritual Realm</h1>
                <div className="page-divider"></div>
                <p className="page-intro">
                    Every divine being named in Scripture - the Watchers, the Elohim council, fallen angels, principalities, foreign gods, and the apocalyptic powers. Click any name to explore.
                </p>
            </header>

            <div className="view-toggle">
                <button
                    className={viewMode === 'cards' ? 'view-active' : ''}
                    onClick={() => setViewMode('cards')}
                >
                    📚 Cards
                </button>
                <button
                    className={viewMode === 'graph' ? 'view-active' : ''}
                    onClick={() => setViewMode('graph')}
                >
                    🌐 Graph
                </button>
            </div>

    {viewMode === 'cards' && (
        <>

            <div className="genre-filter">
                {['All', ...CATEGORIES].map((cat) => (
                    <button
                        key={cat}
                        className={category === cat ? 'genre-active' : ''}
                        style={category === cat && cat !== 'All' ? { background: CATEGORY_COLORS[cat] } : {}}
                        onClick={() => {
                            setCategory(cat)
                            setActiveBeing(null)
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <p className="beings-count">
                Showing {filtered.length} of {BEINGS.length} beings
            </p>

            <div className="books-grid">
                {filtered.map((being) => {
                    const isActive = activeBeing?.name === being.name

                    return (
                        <div
                            key={being.name}
                            className={`book-card ${isActive ? 'book-active' : ''}`}
                            onClick={() => setActiveBeing(isActive ? null : being)}
                        >
                            <div className="book-card-top">
                                <span
                                    className="book-chapters"
                                    style={{ background: CATEGORY_COLORS[being.category]}}
                                >
                                    {being.category}
                                </span>
                            </div>
                            <div className="book-name">{being.name}</div>

                            {being.aka && being.aka.length > 0 && (
                                <div className="being-aka">{being.aka.join(' · ')}</div>
                            )}

                            {isActive && (
                                <div className="book-details">
                                    <p className="book-summary">{being.description}</p>

                                    <div className="book-meta">
                                        <div className="meta-label">THEMES</div>
                                        <div className="theme-tags">
                                            {being.themes.map((theme) => (
                                                <span key={theme} className="theme-tag">{theme}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="meta-label">SCRIPTURE REFERENCE</div>
                                    <p className="book-figures">{being.scripture.join(' · ')}</p>

                                    <div className="meta-label modern-label">MODERN CORRELATIONS</div>
                                    <p className="modern-correlations">{being.modernCorrelations}</p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </>
    )}

    {viewMode === 'graph' && (
                <>
                    <RealmGraph onBeingClick={setActiveBeing} />

                    {activeBeing && (
                        <div className="graph-detail-panel" ref={detailPanelRef}>
                            <button
                                className="close-detail"
                                onClick={() => setActiveBeing(null)}
                                aria-label="Close details"
                            >
                                ×
                            </button>

                            <div className="detail-header">
                                <span
                                    className="book-chapters"
                                    style={{ background: CATEGORY_COLORS[activeBeing.category] }}
                                >
                                    {activeBeing.category}
                                </span>
                                <h2 className="detail-name">{activeBeing.name}</h2>
                                {activeBeing.aka && activeBeing.aka.length > 0 && (
                                    <div className="being-aka">{activeBeing.aka.join(' · ')}</div>
                                )}
                            </div>

                            <div className="book-details">
                                <p className="book-summary">{activeBeing.description}</p>

                                <div className="book-meta">
                                    <div className="meta-label">THEMES</div>
                                    <div className="theme-tags">
                                        {activeBeing.themes.map((theme) => (
                                            <span key={theme} className="theme-tag">{theme}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="meta-label">SCRIPTURE REFERENCE</div>
                                <p className="book-figures">{activeBeing.scripture.join(' · ')}</p>

                                <div className="meta-label modern-label">MODERN CORRELATIONS</div>
                                <p className="modern-correlations">{activeBeing.modernCorrelations}</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default Beings