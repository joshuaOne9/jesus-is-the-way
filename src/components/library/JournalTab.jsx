import { useState, useMemo } from "react";
import { useJournal } from "../../hooks/useJournal";
import JournalEntryEditor from "../JournalEntryEditor";

function JournalTab({ user }) {
  const { entries, loading, createEntry, updateEntry, deleteEntry } =
    useJournal(user);
  const [editingMode, setEditingMode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");

  const allTags = useMemo(() => {
    const tagSet = new Set();
    entries.forEach((e) => e.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (activeTag) {
      result = result.filter((e) => e.tags?.includes(activeTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.content?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (sortOrder === "oldest") {
      result = [...result].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    }

    return result;
  }, [entries, activeTag, searchQuery, sortOrder]);

  function openNew() {
    setEditingMode("new");
  }

  function backToList() {
    setEditingMode(null);
  }

  if (loading) {
    return <p className="library-status">Loading journal…</p>;
  }

  if (editingMode) {
    return (
      <JournalEntryEditor
        entry={editingMode === "new" ? null : editingMode}
        onSave={async (data) => {
          if (editingMode === "new") {
            await createEntry(data);
          } else {
            await updateEntry(editingMode.id, data);
          }
          backToList();
        }}
        onDelete={
          editingMode !== "new"
            ? async () => {
                await deleteEntry(editingMode.id);
                backToList();
              }
            : null
        }
        onCancel={backToList}
      />
    );
  }

  return (
    <div className="journal-tab-v2">
      <div className="journal-toolbar">
        <div className="journal-toolbar-row">
          <div className="journal-search-wrapper">
            <svg
              className="journal-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              className="journal-search-v2"
              placeholder="Search entries"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="journal-sort-v2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button className="journal-new-btn" onClick={openNew}>
            + New
          </button>
        </div>

        {allTags.length > 0 && (
          <div className="journal-tag-filter-v2">
            <button
              className={`journal-tag-chip-v2 ${
                activeTag === null ? "active" : ""
              }`}
              onClick={() => setActiveTag(null)}>
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`journal-tag-chip-v2 ${
                  activeTag === tag ? "active" : ""
                }`}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {entries.length === 0 && <JournalEmptyState onNew={openNew} />}

      {entries.length > 0 && filteredEntries.length === 0 && (
        <div className="journal-empty-v2">
          <p>No entries match your filters.</p>
          <button
            className="journal-link"
            onClick={() => {
              setSearchQuery("");
              setActiveTag(null);
            }}>
            Clear filters
          </button>
        </div>
      )}

      {filteredEntries.length > 0 && (
        <div className="journal-masonry">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className="journal-card"
              onClick={() => setEditingMode(entry)}>
              {entry.title && (
                <h3 className="journal-card-title">{entry.title}</h3>
              )}
              <time className="journal-card-date">
                {new Date(entry.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <div className="journal-card-content">{entry.content}</div>
              {entry.tags?.length > 0 && (
                <div className="journal-card-tags">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`journal-card-tag ${
                        activeTag === tag ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTag(activeTag === tag ? null : tag);
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function JournalEmptyState({ onNew }) {
  return (
    <div className="journal-empty-illustration">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true">
        <rect
          x="22"
          y="18"
          width="76"
          height="92"
          rx="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M30 18 L30 110"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="2 4"
        />
        <line
          x1="40"
          y1="40"
          x2="86"
          y2="40"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="40"
          y1="52"
          x2="86"
          y2="52"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="40"
          y1="64"
          x2="72"
          y2="64"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="60" cy="86" r="10" fill="currentColor" opacity="0.15" />
        <path
          d="M55 86 L59 90 L66 82"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <h3>Your journal is empty</h3>
      <p>
        Start capturing your thoughts, prayers, and study notes.
        <br />
        Entries you create here or from the in-reader drawer all live in one
        place.
      </p>
      <button className="journal-new-btn" onClick={onNew}>
        + Create first entry
      </button>
    </div>
  );
}

export default JournalTab;
