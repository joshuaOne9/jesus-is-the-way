import { useState, useEffect } from "react";
import TRANSLATIONS from "../lib/translations";
import BOOK_CODES from "../lib/bookCodes";

const DEFAULT_TRANSLATION = TRANSLATIONS[0].id;

// Parse API.Bible's HTML chapter response into verses with segments.
// Each segment knows whether it's part of Jesus's words (class="wj").
function parseChapter(html) {
  if (!html) return [];

  const doc = new DOMParser().parseFromString(html, "text/html");
  const walker = doc.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );

  const verses = [];
  let currentVerse = null;

  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList.contains("v")) {
        const num = parseInt(node.getAttribute("data-number"), 10);
        currentVerse = { verse: num, segments: [] };
        verses.push(currentVerse);
      }
      continue;
    }

    if (node.nodeType !== Node.TEXT_NODE || !currentVerse) continue;
    if (node.parentElement?.classList?.contains("v")) continue;

    let isJesus = false;
    let el = node.parentElement;
    while (el && el !== doc.body) {
      if (el.classList?.contains("wj")) {
        isJesus = true;
        break;
      }
      el = el.parentElement;
    }

    const text = node.textContent;
    const last = currentVerse.segments[currentVerse.segments.length - 1];
    if (last && last.isJesus === isJesus) {
      last.text += text;
    } else {
      currentVerse.segments.push({ text, isJesus });
    }
  }

  verses.forEach((v) => {
    v.segments = v.segments
      .map((s) => ({ ...s, text: s.text.replace(/\s+/g, " ") }))
      .filter((s) => s.text.trim().length > 0);
    if (v.segments.length > 0) {
      v.segments[0].text = v.segments[0].text.trimStart();
      const last = v.segments[v.segments.length - 1];
      last.text = last.text.trimEnd();
    }
  });

  return verses;
}

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

  const [translation, setTranslation] = useState(() => {
    try {
      const stored = localStorage.getItem("preferred-translation");
      if (stored && TRANSLATIONS.some((t) => t.id === stored)) {
        return stored;
      }
    } catch {
      // localStorage unavailable (private browsing, etc.)
    }
    return DEFAULT_TRANSLATION;
  });

  useEffect(() => {
    let cancelled = false;

    async function load(attempt) {
      setLoading(true);
      setError(null);
      try {
        const bookCode = BOOK_CODES[book.name];
        if (!bookCode) {
          throw new Error(`No book code mapping for "${book.name}"`);
        }
        const chapterId = `${bookCode}.${chapter}`;
        const res = await fetch(
          `/api/scripture?bibleId=${translation}&chapterId=${chapterId}`,
        );

        if (res.status === 429) throw new Error("rate-limit");
        if (!res.ok) throw new Error("bad-response");

        const payload = await res.json();
        if (cancelled) return;

        const parsedVerses = parseChapter(payload?.data?.content || "");
        setVerses(parsedVerses);
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
  }, [book.name, chapter, reloadKey, translation]);

  useEffect(() => {
    if (!targetVerse || loadedChapter == null) return;
    const el = document.getElementById(`verse-${targetVerse}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => setTargetVerse(null), 2500);
    return () => clearTimeout(t);
  }, [targetVerse, loadedChapter, verses]);

  useEffect(() => {
    try {
      localStorage.setItem("preferred-translation", translation);
    } catch {
      // localStorage unavailable, fail silently
    }
  }, [translation]);

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
    <div className="book-reader" onClick={(e) => e.stopPropagation()}>
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

      <div className="reader-translation">
        <label htmlFor="translation-select">Translation:</label>
        <select
          id="translation-select"
          className="chapter-select translation-select"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}>
          {TRANSLATIONS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
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
            key={`${loadedChapter}-${translation}`}
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
                {verse.segments.map((seg, i) => (
                  <span
                    key={i}
                    className={seg.isJesus ? "verse-red-letter" : ""}>
                    {seg.text}
                  </span>
                ))}
              </p>
            ))}
          </div>

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
