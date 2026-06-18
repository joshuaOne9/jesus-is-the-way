import { useState, useEffect } from "react";

function BookReader({ book }) {
  const [chapter, setChapter] = useState(1);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load(attempt) {
      setLoading(true);
      setError(null);
      try {
        const reference = encodeURIComponent(`${book.name} ${chapter}`);
        const res = await fetch(
          `https://bible-api.com/${reference}?translation=kjv`,
        );

        if (res.status === 429) throw new Error("rate-limit");
        if (!res.ok) throw new Error("bad-response");

        const data = await res.json();
        if (cancelled) return;
        setVerses(data.verses || []);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;

        if (err.message === "rate-limit") {
          setError(
            "The scripture service is busy. Wait a few seconds and try again.",
          );
          setLoading(false);
          return;
        }

        // Transient network hiccup — retry a couple of times before giving up
        if (attempt < 3) {
          setTimeout(() => {
            if (!cancelled) load(attempt + 1);
          }, attempt * 700);
          return;
        }

        setError("Couldn't reach the scripture service.");
        setLoading(false);
      }
    }

    load(1);

    return () => {
      cancelled = true;
    };
  }, [book.name, chapter, reloadKey]);

  function prevChapter() {
    setChapter((c) => Math.max(1, c - 1));
  }

  function nextChapter() {
    setChapter((c) => Math.min(book.chapters, c + 1));
  }

  function retry() {
    setReloadKey((k) => k + 1);
  }

  return (
    <div className="book-reader" onClick={(e) => e.stopPropagation()}>
      <div className="reader-controls">
        <button onClick={prevChapter} disabled={chapter === 1}>
          ← Prev
        </button>
        <span className="reader-chapter">
          {book.name} {chapter}
        </span>
        <button onClick={nextChapter} disabled={chapter === book.chapters}>
          Next →
        </button>
      </div>

      {loading && <p className="reader-status">Loading chapter...</p>}

      {error && (
        <div className="reader-status">
          <p>{error}</p>
          <button onClick={retry}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <div className="reader-text">
          {verses.map((verse) => (
            <p key={verse.verse} className="reader-verse">
              <span className="verse-number">{verse.verse}</span>
              {verse.text.trim()}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookReader;
