import { useState } from "react";
import { useHighlightCategories } from "../../hooks/useHighlightCategories";
import { useAllVerseMarks } from "../../hooks/useAllVerseMarks";

function CategoriesTab({ user }) {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useHighlightCategories(user);
  const { marks, loading: marksLoading } = useAllVerseMarks(user);
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Group marks by category_id for fast lookup
  const marksByCategory = {};
  const uncategorizedMarks = [];
  marks.forEach((m) => {
    if (m.category_id) {
      if (!marksByCategory[m.category_id]) marksByCategory[m.category_id] = [];
      marksByCategory[m.category_id].push(m);
    } else {
      uncategorizedMarks.push(m);
    }
  });

  if (loading || marksLoading) {
    return <p className="library-status">Loading categories…</p>;
  }

  return (
    <div className="categories-tab">
      <div className="categories-intro">
        <p>
          Categories are the color labels you apply to verses. Click any
          category to see every verse you've marked with it.
        </p>
      </div>

      {!creating && (
        <button
          type="button"
          className="btn-primary"
          onClick={() => setCreating(true)}>
          + Create new category
        </button>
      )}

      {creating && (
        <CategoryForm
          onSave={async (data) => {
            await createCategory(data.name, data.color);
            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      {categories.length === 0 && !creating && (
        <p className="empty-state">
          No categories yet. Create one to start highlighting verses.
        </p>
      )}

      {categories.length > 0 && (
        <div className="categories-list">
          {categories.map((cat) => {
            if (editingId === cat.id) {
              return (
                <CategoryForm
                  key={cat.id}
                  existing={cat}
                  onSave={async (data) => {
                    await updateCategory(cat.id, data);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              );
            }

            const linkedMarks = marksByCategory[cat.id] || [];
            const isExpanded = expandedIds.has(cat.id);

            return (
              <div key={cat.id} className="category-block">
                <div className="category-row">
                  <button
                    type="button"
                    className="category-expand"
                    onClick={() =>
                      setExpandedIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(cat.id)) {
                          next.delete(cat.id);
                        } else {
                          next.add(cat.id);
                        }
                        return next;
                      })
                    }
                    aria-expanded={isExpanded}
                    aria-label={`Toggle verses for ${cat.name}`}>
                    {isExpanded ? "▼" : "▶"}
                  </button>
                  <div
                    className="category-swatch"
                    style={{ backgroundColor: cat.color }}
                    aria-label={`Color: ${cat.color}`}
                  />
                  <div className="category-info">
                    <div className="category-name">{cat.name}</div>
                    <div className="category-meta">
                      {linkedMarks.length}{" "}
                      {linkedMarks.length === 1 ? "verse" : "verses"} ·{" "}
                      {cat.color}
                    </div>
                  </div>
                  <div className="category-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => setEditingId(cat.id)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      onClick={async () => {
                        if (
                          window.confirm(
                            `Delete "${cat.name}"? ${linkedMarks.length} highlighted ${
                              linkedMarks.length === 1 ? "verse" : "verses"
                            } will keep ${
                              linkedMarks.length === 1 ? "its" : "their"
                            } notes but lose this color.`,
                          )
                        ) {
                          await deleteCategory(cat.id);
                        }
                      }}>
                      Delete
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="category-verses">
                    {linkedMarks.length === 0 ? (
                      <p className="empty-state-sm">
                        No verses marked with this category yet.
                      </p>
                    ) : (
                      linkedMarks.map((mark) => (
                        <div key={mark.id} className="linked-verse">
                          <div className="linked-verse-ref">
                            {mark.book_name} {mark.chapter}:{mark.verse}
                          </div>
                          {mark.note && (
                            <div className="linked-verse-note">{mark.note}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {uncategorizedMarks.length > 0 && (
        <div className="uncategorized-section">
          <h3 className="uncategorized-title">
            Uncategorized notes ({uncategorizedMarks.length})
          </h3>
          <p className="empty-state-sm">
            Verses with notes but no color category. Open them in the reader to
            assign a category.
          </p>
          <div className="category-verses">
            {uncategorizedMarks.map((mark) => (
              <div key={mark.id} className="linked-verse">
                <div className="linked-verse-ref">
                  {mark.book_name} {mark.chapter}:{mark.verse}
                </div>
                {mark.note && (
                  <div className="linked-verse-note">{mark.note}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryForm({ existing, onSave, onCancel }) {
  const [name, setName] = useState(existing?.name || "");
  const [color, setColor] = useState(existing?.color || "#d4af37");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    await onSave({ name: name.trim(), color });
    setSaving(false);
  }

  return (
    <div className="category-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name (e.g., Promise)"
        className="category-form-name"
        autoFocus
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="category-form-color"
        aria-label="Color"
      />
      <button
        type="button"
        className="btn-primary btn-sm"
        onClick={handleSave}
        disabled={saving || !name.trim()}>
        {saving ? "Saving…" : existing ? "Update" : "Create"}
      </button>
      <button
        type="button"
        className="btn-secondary btn-sm"
        onClick={onCancel}
        disabled={saving}>
        Cancel
      </button>
    </div>
  );
}

export default CategoriesTab;
