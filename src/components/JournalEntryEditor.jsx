import { useState } from "react";

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

export default JournalEntryEditor;
