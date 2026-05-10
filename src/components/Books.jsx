import { useState } from 'react'
import { BOOKS, OT_GENRES, NT_GENRES, GENRE_COLORS } from '../data/books'

function Books() {
    const [testament, setTestament] = useState('Both')
    const [genre, setGenre] = useState('All')
    const [activeBook, setActiveBook] = useState(null)

    const genres =
        testament === 'OT' ? OT_GENRES :
        testament === 'NT' ? NT_GENRES :
        [...OT_GENRES, ...NT_GENRES]

    const filtered = BOOKS.filter((book) => {
        const matchTestament = testament === 'Both' || book.testament === testament
        const matchGenre = genre === 'All' || book.genre === genre
        return matchTestament && matchGenre
    })


    return (
        <section className="page books">
            <header className="page-header">
                <p className="page-eyebrow">Scripture</p>
                <h1>Books of The Bible</h1>
                <div className="page-divider"></div>
                <p className="page-intro">
                    All {BOOKS.length} canonical books. Click any book to explore it.
                </p>
            </header>

            <div className="testament-filter">
                {['Both', 'OT', 'NT'].map((option) => (
                  <button
                    key={option}
                    className={testament === option ? 'filter-active' : ''}
                    onClick={() => {
                      setTestament(option)
                      setGenre('All')
                    }}
                  >
                    {option === 'Both' ? 'Both Testaments' : option === 'OT' ? 'Old Testament' : 'New Testament'}
                  </button>
                ))}
            </div>

            <div className="genre-filter">
                {['All', ...genres].map((g) => (
                    <button
                      key={g}
                      className={genre === g ? 'genre-active' : ''}
                      style={genre === g && g !== 'All' ? { background: GENRE_COLORS[g] } : {}}
                      onClick={() => setGenre(g)}
                    >
                      {g}
                    </button>
                ))}
            </div>

            <p className="books-count">
                Showing {filtered.length} books
            </p>

            <div className="books-grid">
                {filtered.map((book) => {
                    const isActive = activeBook?.name === book.name

                    return (
                        <div
                            key={book.name}
                            className={`book-card ${isActive ? 'book-active' : ''}`}
                            onClick={() => setActiveBook(isActive ? null : book )}
                        >
                            <div className="book-card-top">
                                <span className="book-testament">{book.testament}</span>
                                <span
                                    className="book-chapters"
                                    style={{ background: GENRE_COLORS[book.genre] }}
                                >

                                    {book.chapters} ch
                                </span>
                            </div>
                            <div className="book-name">{book.name}</div>
                            <div className="book-genre">{book.genre}</div>
                            
                            {isActive && (
                                <div className="book-details">
                                <p className="book-summary">{book.summary}</p>

                                <div className="book-meta">
                                    <div className="meta-label">THEMES</div>
                                    <div className="theme-tags">
                                        {book.themes.map((theme) => (
                                            <span key={theme} className="theme-tag">{theme}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="meta-label">KEY FIGURES</div>
                                <p className="book-figures">{book.figures.join(' . ')}</p>
                            </div>
                        )}
                    </div>
                )
                })}
            </div>
        </section>
    )
}

export default Books