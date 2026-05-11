import { useState } from "react"

const TRANSLATIONS = [
  { id: 'web',   short: 'WEB',   name: 'World English Bible',     note: 'Modern, readable - public domain' },
  { id: 'kjv',   short: 'KJV',   name: 'King James Version',      note: '1611 classic Elizabethan English' },
  { id: 'asv',   short: 'ASV',   name: 'American Standard',       note: '1901 - foundational literal translation' },
  { id: 'bbe',   short: 'BBE',   name: 'Bible in Basic English',  note: 'Simple English - ~1,000 core words' },
  { id: 'ylt',   short: 'YLT',   name: 'Young\'s Literal',        note: 'Extremely literal - word-for-word' },
  { id: 'darby', short: 'DARBY', name: 'Darby Bible',             note: 'Scholarly literal translation' },
  { id: 'dra',   short: 'DRA',   name: 'Douay-Rheims',            note: 'Catholic - from Latin Vulgate' },
]

const POPULAR = [
  'John 3:16',
  'Psalm 23',
  'Romans 8:28',
  'Genesis 1:1',
  'Philippians 4:13',
  'Isaiah 53',
  'Psalm 91',
  '1 Corinthians 13',
  'Matthew 5:1-12',
  'Romans 12:1-2',
  'Revelation 21:1-7',
]

function Read() {
  const [reference, setReference] = useState('')
  const [translation, setTranslation] = useState('web')
  const [passage, setPassage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function lookup(refOverride) {
    const refToUse = (refOverride ?? reference).trim()
    if (!refToUse || loading) return

    setReference(refToUse)
    setLoading(true)
    setPassage(null)
    setError('')

    try {
      const formatted = refToUse.replace(/\s+/g, '+')
      const url = `https://bible-api.com/${formatted}?translation=${translation}`
      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setPassage(data)
      }
    } catch (err) {
      console.error('Fetch failed:', err)
      setError('Unable to fetch passage. Check your connection and try again.')  
    }

    setLoading(false)
  }

  return (
    <section className="page read">
      <header className="page-header">
        <p className="page-eyebrow">Holy Scripture</p>
        <h1>Read the Word</h1>
        <div className="page-divider"></div>
        <p className="page-intro">
          Look up any passage. Try <span className="hint">John 3:16</span> or <span className="hint">Psalm 23</span>.
        </p>
      </header>

      <div className="translation-row">
        <div className="filter-label">TRANSLATION</div>
        <div className="translation-pills">
          {TRANSLATIONS.map((t) => (
            <button
              key={t.id}
              className={translation === t.id ? 'translation-active' : ''}
              onClick={() => setTranslation(t.id)}
              title={t.note}
            >
              {t.short}
            </button>
          ))}
        </div>
      </div>

      <div className="search-row">
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') lookup() }}
          placeholder="Enter a reference (e.g. John 3:16)"
          className="reference-input"
        />
        <button
          className="read-button"
          onClick={() => lookup()}
          disabled={loading}
        >
          {loading ? 'Reading...' : 'Read →'}
        </button>
      </div>

      <div className="popular-row">
        <div className="filter-label">POPULAR PASSAGES</div>
        <div className="popular-pills">
          {POPULAR.map((p) => (
            <button
              key={p}
              onClick={() => lookup(p)}
              className="popular-pill"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="status">Loading passage...</p>}

      {error && (
        <div className="error-card">
          <strong>Passage not found.</strong>
          <p>{error}</p>
          <p className="hint">Try: <span>John 3:16</span> . <span>Psalm 23</span> . <span>1 Cor 13:4-8</span></p>
        </div>
      )}

      {passage && !error && (
        <div className="passage-card">
          <div className="passage-header">
            <h2>{passage.reference}</h2>
            <span className="passage-translation">{passage.translation_name}</span>
          </div>
          <div className="passage-text">
            {passage.verses.map((v, index) => (
              <span key={index}>
                <sup className="verse-num">{v.verse}</sup>
                {v.text.trim()}{' '}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Read