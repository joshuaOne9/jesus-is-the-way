import { useState, useEffect } from "react";
import { useJournal } from "../hooks/useJournal";
import { createPortal } from "react-dom";

function JournalDrawer({ user, currentReference }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingMode, setEditingMode] = useState(null);
  const { entries, loading, createEntry, updateEntry, deleteEntry } =
    useJournal(user);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("journal-open");
    } else {
      document.body.classList.remove("journal-open");
    }

    return () => {
      document.body.classList.remove("journal-open");
    };
  }, [isOpen]);

  if (!user) return null;

  function openNew() {
    setEditingMode("new");
    if (!isOpen) setIsOpen(true);
  }

  function backToList() {
    setEditingMode(null);
  }

  return createPortal(
    <>
      <button
        type="button"
        className={`journal-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close journal" : "Open journal"}>
        {isOpen ? "× Close" : "📖 Journal"}
      </button>

      <aside className={`journal-drawer ${isOpen ? "open" : ""}`}>
        <div className="journal-drawer-content">
          <div className="journal-drawer-header">
            <h2>Journal</h2>
            {!editingMode && (
              <button className="btn-primary btn-sm" onClick={openNew}>
                + New
              </button>
            )}
          </div>

          {editingMode ? (
            <JournalEntryEditor
              entry={editingMode === "new" ? null : editingMode}
              currentReference={currentReference}
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
          ) : (
            <JournalEntryList
              entries={entries}
              loading={loading}
              onSelect={setEditingMode}
            />
          )}
        </div>
      </aside>
    </>,
    document.body,
  );
}

function JournalEntryList({ entries, loading, onSelect }) {
  if (loading) return <p className="journal-status">Loading entries…</p>;

  if (entries.length === 0) {
    return (
      <div className="journal-empty">
        <p>No entries yet.</p>
        <p>Click "+ New" to start your study journal.</p>
      </div>
    );
  }

  return (
    <div className="journal-list">
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className="journal-entry-card"
          onClick={() => onSelect(entry)}>
          {entry.title && (
            <h3 className="journal-entry-title">{entry.title}</h3>
          )}
          <p className="journal-entry-preview">
            {entry.content.slice(0, 200)}
            {entry.content.length > 200 ? "…" : ""}
          </p>
          <div className="journal-entry-meta">
            {entry.tags?.length > 0 && (
              <div className="journal-entry-tags">
                {entry.tags.map((tag) => (
                  <span key={tag} className="journal-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <time className="journal-entry-date">
              {new Date(entry.created_at).toLocaleDateString()}
            </time>
          </div>
        </button>
      ))}
    </div>
  );
}

function JournalEntryEditor({
  entry,
  currentReference,
  onSave,
  onDelete,
  onCancel,
}) {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [tagsInput, setTagsInput] = useState(entry?.tags?.join(", ") || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!content.trim()) return;
    setSaving(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    await onSave({
      title: title.trim() || null,
      content: content.trim(),
      tags,
    });
    setSaving(false);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this journal entry?")) return;
    setSaving(true);
    await onDelete();
    setSaving(false);
  }

  function addReference() {
    if (!currentReference) return;
    setContent(
      (prev) => prev + (prev ? "\n\n" : "") + `Reading: ${currentReference}`,
    );
  }

  return (
    <div className="journal-editor">
      <input
        type="text"
        className="journal-title-input"
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="journal-content-input"
        placeholder="What's on your heart today?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
        autoFocus={!entry}
      />
      <input
        type="text"
        className="journal-tags-input"
        placeholder="Tags, comma-separated (e.g., prayer, gratitude, study)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />
      {currentReference && (
        <button type="button" className="link-button" onClick={addReference}>
          + Add current reading reference ({currentReference})
        </button>
      )}
      <div className="journal-editor-actions">
        {onDelete && (
          <button
            type="button"
            className="btn-danger"
            onClick={handleDelete}
            disabled={saving}>
            Delete
          </button>
        )}
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={saving}>
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={saving || !content.trim()}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default JournalDrawer;
