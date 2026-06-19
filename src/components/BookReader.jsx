import { useState, useEffect, useRef } from "react";

function BookReader({ book }) {
  const [chapter, setChapter] = useState(1);
  const [verses, setVerses] = useState([]);
  const [loadedChapter, setLoadedChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [direction, setDirection] = useState("next");
  const [jump, setJump] = useState("");
  const [targetVerse, setTargetVerse] = useState(null);

  const readerRef = useRef(null);
  const isFirstRender = useRef(true);

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
        setLoadedChapter(chapter);
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

  // Scroll the reader into view whenever the chapter changes — except on
  // first mount, and except when a specific verse was searched (that has
  // its own scroll logic below).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (targetVerse) return;
    readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [chapter, targetVerse]);

  // Scroll to and highlight a searched verse once the chapter has loaded
  useEffect(() => {
    if (!targetVerse || loadedChapter == null) return;
    const el = document.getElementById(`verse-${targetVerse}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => setTargetVerse(null), 2500);
    return () => clearTimeout(t);
  }, [targetVerse, loadedChapter, verses]);

  function prevChapter() {
    setDirection("prev");
    setChapter((c) => Math.max(1, c - 1));
  }

  function nextChapter() {
    setDirection("next");
    setChapter((c) => Math.min(book.chapters, c + 1));
  }

  function jumpToChapter(ch) {
    setDirection(ch >= chapter ? "next" : "prev");
    setChapter(ch);
  }

  function retry() {
    setReloadKey((k) => k + 1);
  }

  function goToReference(e) {
    e.preventDefault();
    const nums = jump.match(/\d+/g);
    if (!nums || nums.length === 0) return;
    const ch = Math.min(book.chapters, Math.max(1, parseInt(nums[0], 10)));
    const vs = nums[1] ? parseInt(nums[1], 10) : null;
    setDirection(ch >= chapter ? "next" : "prev");
    setChapter(ch);
    setTargetVerse(vs);
    setJump("");
  }

  return (
    <div
      className="book-reader"
      ref={readerRef}
      onClick={(e) => e.stopPropagation()}>
      <div className="reader-controls">
        <button onClick={prevChapter} disabled={chapter === 1}>
          ← Prev
        </button>
        <span className="reader-chapter">
          {book.name}{" "}
          <select
            className="chapter-select"
            value={chapter}
            onChange={(e) => jumpToChapter(Number(e.target.value))}
            aria-label="Jump to chapter">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </span>
        <button onClick={nextChapter} disabled={chapter === book.chapters}>
          Next →
        </button>
      </div>

      <form className="reader-search" onSubmit={goToReference}>
        <input
          type="text"
          value={jump}
          onChange={(e) => setJump(e.target.value)}
          placeholder={`Find a verse — e.g. 3 · 3:16 · "chapter 3 verse 16"  (1–${book.chapters})`}
          aria-label="Go to chapter or verse"
        />
        <button type="submit">Go</button>
      </form>

      {loading && <div className="reader-loading-bar" />}

      {error && (
        <div className="reader-error">
          <span>{error}</span>
          <button onClick={retry}>Try again</button>
        </div>
      )}

      {verses.length === 0 && loading && (
        <p className="reader-status">Loading chapter…</p>
      )}

      {verses.length > 0 && (
        <>
          <div
            key={loadedChapter}
            className={`reader-text ${
              direction === "next" ? "page-forward" : "page-backward"
            } ${loading ? "reader-text-loading" : ""}`}>
            {verses.map((verse) => (
              <p
                key={verse.verse}
                id={`verse-${verse.verse}`}
                className={`reader-verse ${
                  verse.verse === targetVerse ? "verse-highlight" : ""
                }`}>
                <span className="verse-number">{verse.verse}</span>
                {verse.text.trim()}
              </p>
            ))}
          </div>

          {/* Bottom controls — mirror the top so readers don't scroll up */}
          <div className="reader-controls reader-controls-bottom">
            <button onClick={prevChapter} disabled={chapter === 1}>
              ← Prev
            </button>
            <span className="reader-chapter">
              {book.name}{" "}
              <select
                className="chapter-select"
                value={chapter}
                onChange={(e) => jumpToChapter(Number(e.target.value))}
                aria-label="Jump to chapter">
                {Array.from({ length: book.chapters }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ),
                )}
              </select>
            </span>
            <button onClick={nextChapter} disabled={chapter === book.chapters}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default BookReader;
