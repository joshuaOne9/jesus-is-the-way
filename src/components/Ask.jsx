import { useState } from 'react'

const SUGGESTED = [
    'Who are the Watchers in 1 Enoch?',
    'What is the Elohim council in Psalm 82?',
    'Who is Melchizedek and why is he significant?',
    'What does the Bible say about fallen angels?',
    'What are the principalities and powers Paul mentions in Ephesians?',
    'Why isn\'t the Book of Enoch in the Bible?',
    'Who is the Angel of the Lord in the Old Testament?',
    'What does Revelation say about the Beast and the false prophet?',
]

function Ask() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function ask(overrideQuestion) {
        const q = (overrideQuestion ?? question).trim()
        if (!q || loading) return

        setQuestion(q)
        setLoading(true)
        setAnswer('')
        setError('')

        try {
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: q })
            })

            const data = await response.json()

            if (data.error) {
                setError(data.error)
            } else {
                setAnswer(data.answer)
            }
        } catch (err) {
            console.error('Ask failed:', err)
            setError('Unable to reach the server. Try again in a moment.')
        }

        setLoading(false)
    }

    return (
        <section className="page ask">
            <header className="page-header">
                <p className="page-eyebrow">AI-Powered Biblical Scholarship</p>
                <h1>Ask a Question</h1>
                <div className="page-divider"></div>
                <p className="page-intro">
                    Ask anything - theology, prophecy, Watchers, divine council, non-canonical texts, or the ehard of the Gospel.
                </p>
            </header>

            <div className="ask-card">
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            ask()
                        }
                    }}
                    placeholder="E.g. Who are the Watchers in 1 Enoch? What is the divine council? Who are the principalities and powers?"
                    className="'ask-textarea"
                />
                <button
                    className="ask-button"
                    onClick={() => ask()}
                    disabled={loading}
                >
                    {loading ? 'Searcing Scripture...' : 'Ask →'}
                </button>
            </div>

            {error && (
                <div className="error-card">
                    <strong>Something went wrong.</strong>
                    <p>{error}</p>
                </div>
            )}

            {answer && !error && (
                <div className="answer-card">
                    <div className="answer-label">RESPONSE</div>
                    <p className="answer-text">{answer}</p>
                </div>
            )}

            <div className="suggested-row">
                <div className="filter-label">SUGGESTED QUESTIONS</div>
                <div className="suggested-pills">
                    {SUGGESTED.map((s) => (
                        <button
                            key={s}
                            onClick={() => ask(s)}
                            className="popular-pill"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Ask