import { useState } from "react";

function VerseMarkModal({
  bookName,
  chapter,
  verse,
  currentMark,
  categories,
  onSave,
  onDelete,
  onClose,
  onCreateCategory,
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    currentMark?.category_id || null,
  );
  const [noteText, setNoteText] = useState(currentMark?.note || "");
  const [creatingNew, setCreatingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#d4af37");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    let categoryId = selectedCategoryId;

    if (creatingNew && newCategoryName.trim()) {
      const newCat = await onCreateCategory(
        newCategoryName.trim(),
        newCategoryColor,
      );
      if (newCat) {
        categoryId = newCat.id;
      }
    }

    // Only save if there's actually something to save (category or note)
    if (categoryId || noteText.trim()) {
      await onSave({ categoryId, note: noteText.trim() || null });
    } else if (currentMark) {
      // User cleared everything — delete the mark
      await onDelete();
    }

    setSaving(false);
    onClose();
  }

  async function handleDelete() {
    setSaving(true);
    await onDelete();
    setSaving(false);
    onClose();
  }

  return (
    <div className="verse-modal-backdrop" onClick={onClose}>
      <div className="verse-modal" onClick={(e) => e.stopPropagation()}>
        <div className="verse-modal-header">
          <h3>
            {bookName} {chapter}:{verse}
          </h3>
          <button
            className="verse-modal-close"
            onClick={onClose}
            aria-label="Close">
            ×
          </button>
        </div>

        <div className="verse-modal-section">
          <div className="meta-label">HIGHLIGHT COLOR</div>

          {categories.length === 0 && !creatingNew && (
            <p className="empty-state">
              No categories yet. Create one to start highlighting.
            </p>
          )}

          {!creatingNew && categories.length > 0 && (
            <div className="category-chips">
              <button
                type="button"
                className={`category-chip category-chip-none ${
                  selectedCategoryId === null ? "selected" : ""
                }`}
                onClick={() => setSelectedCategoryId(null)}>
                None
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${
                    selectedCategoryId === cat.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  style={{ backgroundColor: cat.color }}>
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {!creatingNew && (
            <button
              type="button"
              className="link-button"
              onClick={() => setCreatingNew(true)}>
              + Create new category
            </button>
          )}

          {creatingNew && (
            <div className="new-category-form">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name (e.g., Promise)"
                autoFocus
              />
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                aria-label="Color"
              />
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setCreatingNew(false);
                  setNewCategoryName("");
                }}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="verse-modal-section">
          <div className="meta-label">NOTE</div>
          <textarea
            className="verse-note-input"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note about this verse..."
            rows={4}
          />
        </div>

        <div className="verse-modal-actions">
          {currentMark && (
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
            onClick={onClose}
            disabled={saving}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerseMarkModal;
