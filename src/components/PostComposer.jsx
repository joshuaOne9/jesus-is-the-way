import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createPost, updatePost } from "../hooks/usePosts";

function PostComposer({ user, isOpen, onClose, editingPostId, initialPost }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("draft");
  const [postId, setPostId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);
  const [confirmingPublish, setConfirmingPublish] = useState(false);

  // Load an existing post into the composer when editing
  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || "");
      setBody(initialPost.body || "");
      setStatus(initialPost.status || "draft");
      setPostId(initialPost.id);
    } else if (!editingPostId) {
      // Fresh composer
      setTitle("");
      setBody("");
      setStatus("draft");
      setPostId(null);
    }
  }, [initialPost, editingPostId]);

  // Toggle body class for push-aside layout (same pattern as journal drawer)
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("composer-open");
    } else {
      document.body.classList.remove("composer-open");
    }
    return () => document.body.classList.remove("composer-open");
  }, [isOpen]);

  if (!user || !isOpen) return null;

  async function saveDraft() {
    if (!title.trim()) {
      setError("Give your teaching a title before saving.");
      return null;
    }
    setSaving(true);
    setError(null);

    let result;
    if (postId) {
      result = await updatePost(postId, {
        title: title.trim(),
        body: body,
      });
    } else {
      result = await createPost(user, {
        title: title.trim(),
        body: body,
        status: "draft",
      });
    }

    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return null;
    }
    setPostId(result.data.id);
    setStatus(result.data.status);
    setSavedAt(new Date());
    return result.data;
  }

  async function handlePublish() {
    // First make sure the draft is saved
    let saved = { id: postId };
    if (!postId) {
      saved = await saveDraft();
      if (!saved) return;
    } else {
      const ok = await saveDraft();
      if (!ok) return;
    }

    setSaving(true);
    const result = await updatePost(saved.id || postId, {
      status: "published",
    });
    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    setStatus("published");
    setConfirmingPublish(false);
    setSavedAt(new Date());
  }

  return createPortal(
    <aside className={`composer-drawer ${isOpen ? "open" : ""}`}>
      <div className="composer-inner">
        <div className="composer-header">
          <div>
            <p className="composer-eyebrow">Answer the Call</p>
            <h2>{postId ? "Edit Teaching" : "Write a Teaching"}</h2>
          </div>
          <button
            className="composer-close"
            onClick={onClose}
            aria-label="Close composer">
            ×
          </button>
        </div>

        <p className="composer-scripture">"Here am I. Send me." — Isaiah 6:8</p>

        <input
          type="text"
          className="composer-title"
          placeholder="Title of your teaching"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="composer-body"
          placeholder="Share what's on your heart…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={16}
        />

        {error && <p className="composer-error">{error}</p>}

        <div className="composer-status-row">
          {status === "published" ? (
            <span className="composer-badge composer-badge-published">
              Published
            </span>
          ) : (
            <span className="composer-badge composer-badge-draft">Draft</span>
          )}
          {savedAt && (
            <span className="composer-saved">
              Saved{" "}
              {savedAt.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <div className="composer-actions">
          <button
            className="btn-secondary"
            onClick={saveDraft}
            disabled={saving}>
            {saving ? "Saving…" : "Save draft"}
          </button>

          {status !== "published" && (
            <button
              className="composer-publish-btn"
              onClick={() => setConfirmingPublish(true)}
              disabled={saving || !title.trim()}>
              Publish
            </button>
          )}
        </div>

        {confirmingPublish && (
          <div className="composer-confirm">
            <p>
              Publish this teaching to the community? It will be visible to
              everyone on Born to Be.
            </p>
            <div className="composer-confirm-actions">
              <button
                className="btn-secondary"
                onClick={() => setConfirmingPublish(false)}
                disabled={saving}>
                Not yet
              </button>
              <button
                className="composer-publish-btn"
                onClick={handlePublish}
                disabled={saving}>
                {saving ? "Publishing…" : "Yes, publish"}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>,
    document.body,
  );
}

export default PostComposer;
