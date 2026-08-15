import { useState } from "react";
import TRANSLATIONS from "../lib/translations";
import BOOK_CODES from "../lib/bookCodes";

const POPULAR = [
  "John 3:16",
  "Psalm 23",
  "Romans 8:28",
  "Genesis 1:1",
  "Philippians 4:13",
  "Isaiah 53",
  "Psalm 91",
  "1 Corinthians 13",
  "Matthew 5:1-12",
  "Romans 12:1-2",
  "Revelation 21:1-7",
];

// Some common abbreviations users might type — expand as needed.
const BOOK_ALIASES = {
  "1 cor": "1 Corinthians",
  "2 cor": "2 Corinthians",
  "1 thes": "1 Thessalonians",
  "2 thes": "2 Thessalonians",
  "1 tim": "1 Timothy",
  "2 tim": "2 Timothy",
  "1 pet": "1 Peter",
  "2 pet": "2 Peter",
  "1 jn": "1 John",
  "2 jn": "2 John",
  "3 jn": "3 John",
  ps: "Psalms",
  psalm: "Psalms",
  gen: "Genesis",
  ex: "Exodus",
  rev: "Revelation",
  matt: "Matthew",
  rom: "Romans",
  phil: "Philippians",
};

// Parse "John 3:16" or "1 Cor 13:4-8" or "Psalm 23" into components
function parseReference(input) {
  const trimmed = input.trim();
  // Match: <book name> <chapter>[:<verse>[-<verseEnd>]]
  // Book can be like "1 Corinthians" or "Genesis"
  const match = trimmed.match(
    /^(\d?\s?[a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/,
  );
  if (!match) return null;

  let [, rawBook, chapter, verseStart, verseEnd] = match;
  const bookKey = rawBook.trim().toLowerCase();

  // Try aliases first, then match against BOOK_CODES keys case-insensitively
  let bookName = BOOK_ALIASES[bookKey];
  if (!bookName) {
    bookName = Object.keys(BOOK_CODES).find((b) => b.toLowerCase() === bookKey);
  }
  if (!bookName) return null;

  return {
    bookName,
    chapter: parseInt(chapter, 10),
    verseStart: verseStart ? parseInt(verseStart, 10) : null,
    verseEnd: verseEnd ? parseInt(verseEnd, 10) : null,
  };
}

// Parse API.Bible HTML response into verses array (same as BookReader)
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
        currentVerse = { verse: num, text: "" };
        verses.push(currentVerse);
      }
      continue;
    }

    if (node.nodeType !== Node.TEXT_NODE || !currentVerse) continue;
    if (node.parentElement?.classList?.contains("v")) continue;

    currentVerse.text += node.textContent;
  }

  return verses
    .map((v) => ({ ...v, text: v.text.replace(/\s+/g, " ").trim() }))
    .filter((v) => v.text.length > 0);
}

function Read() {
  const [reference, setReference] = useState("");
  const [translation, setTranslation] = useState(TRANSLATIONS[0].id);
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup(refOverride) {
    const refToUse = (refOverride ?? reference).trim();
    if (!refToUse || loading) return;

    setReference(refToUse);
    setLoading(true);
    setPassage(null);
    setError("");

    const parsed = parseReference(refToUse);
    if (!parsed) {
      setError(
        `Couldn't understand "${refToUse}". Try a format like "John 3:16" or "Psalm 23".`,
      );
      setLoading(false);
      return;
    }

    const bookCode = BOOK_CODES[parsed.bookName];
    if (!bookCode) {
      setError(`No book code found for "${parsed.bookName}".`);
      setLoading(false);
      return;
    }

    try {
      const chapterId = `${bookCode}.${parsed.chapter}`;
      const res = await fetch(
        `/api/scripture?bibleId=${translation}&chapterId=${chapterId}`,
      );

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }

      const payload = await res.json();
      const allVerses = parseChapter(payload?.data?.content || "");

      // Filter to requested verse range if specified
      let verses = allVerses;
      if (parsed.verseStart) {
        const end = parsed.verseEnd || parsed.verseStart;
        verses = allVerses.filter(
          (v) => v.verse >= parsed.verseStart && v.verse <= end,
        );
      }

      if (verses.length === 0) {
        setError(`No verses found for ${refToUse}.`);
        setLoading(false);
        return;
      }

      // Build a nice display reference
      let displayRef = `${parsed.bookName} ${parsed.chapter}`;
      if (parsed.verseStart) {
        displayRef += `:${parsed.verseStart}`;
        if (parsed.verseEnd && parsed.verseEnd !== parsed.verseStart) {
          displayRef += `-${parsed.verseEnd}`;
        }
      }

      // Find the label for the current translation
      const translationLabel =
        TRANSLATIONS.find((t) => t.id === translation)?.label || "";

      setPassage({
        reference: displayRef,
        translation_name: translationLabel,
        verses,
      });
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Unable to fetch passage. Check your connection and try again.");
    }

    setLoading(false);
  }

  return (
    <section className="page read">
      <header className="page-header">
        <p className="page-eyebrow">Holy Scripture</p>
        <h1>Read the Word</h1>
        <div className="page-divider"></div>
        <p className="page-intro">
          Look up any passage. Try <span className="hint">John 3:16</span> or{" "}
          <span className="hint">Psalm 23</span>.
        </p>
      </header>

      <div className="translation-row">
        <div className="filter-label">TRANSLATION</div>
        <div className="translation-pills">
          {TRANSLATIONS.map((t) => (
            <button
              key={t.id}
              className={translation === t.id ? "translation-active" : ""}
              onClick={() => setTranslation(t.id)}
              title={t.label}>
              {t.label.split(" — ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="search-row">
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") lookup();
          }}
          placeholder="Enter a reference (e.g. John 3:16)"
          className="reference-input"
        />
        <button
          className="read-button"
          onClick={() => lookup()}
          disabled={loading}>
          {loading ? "Reading..." : "Read →"}
        </button>
      </div>

      <div className="popular-row">
        <div className="filter-label">POPULAR PASSAGES</div>
        <div className="popular-pills">
          {POPULAR.map((p) => (
            <button key={p} onClick={() => lookup(p)} className="popular-pill">
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
          <p className="hint">
            Try: <span>John 3:16</span> · <span>Psalm 23</span> ·{" "}
            <span>1 Cor 13:4-8</span>
          </p>
        </div>
      )}

      {passage && !error && (
        <div className="passage-card">
          <div className="passage-header">
            <h2>{passage.reference}</h2>
            <span className="passage-translation">
              {passage.translation_name}
            </span>
          </div>
          <div className="passage-text">
            {passage.verses.map((v, index) => (
              <span key={index}>
                <sup className="verse-num">{v.verse}</sup>
                {v.text}{" "}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Read;
