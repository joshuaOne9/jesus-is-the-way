import { useMyPosts, deletePost } from "../../hooks/usePosts";

function TeachingsTab({ user, onOpenComposer }) {
  const { posts, loading, refresh } = useMyPosts(user);

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) {
      return;
    }
    const { error } = await deletePost(post.id);
    if (!error) refresh();
  }

  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  return (
    <div className="teachings-tab">
      <div className="teachings-header">
        <div>
          <p className="teachings-eyebrow">Answer the Call</p>
          <p className="teachings-intro">
            Write and share teachings with the Born to Be community.
          </p>
        </div>
        <button
          className="composer-publish-btn"
          onClick={() => onOpenComposer()}>
          ✍ Write a Teaching
        </button>
      </div>

      {loading && <p className="library-status">Loading your teachings…</p>}

      {!loading && posts.length === 0 && (
        <div className="teachings-empty">
          <p>You haven't written any teachings yet.</p>
          <p>When you're ready, answer the call — write your first one.</p>
        </div>
      )}

      {drafts.length > 0 && (
        <div className="teachings-section">
          <h3 className="teachings-section-title">Drafts ({drafts.length})</h3>
          <div className="teachings-list">
            {drafts.map((post) => (
              <div key={post.id} className="teaching-row">
                <div className="teaching-row-main">
                  <span className="teaching-badge teaching-badge-draft">
                    Draft
                  </span>
                  <span className="teaching-row-title">
                    {post.title || "Untitled"}
                  </span>
                </div>
                <div className="teaching-row-actions">
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => onOpenComposer(post)}>
                    Continue
                  </button>
                  <button
                    className="btn-danger btn-sm"
                    onClick={() => handleDelete(post)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {published.length > 0 && (
        <div className="teachings-section">
          <h3 className="teachings-section-title">
            Published ({published.length})
          </h3>
          <div className="teachings-list">
            {published.map((post) => (
              <div key={post.id} className="teaching-row">
                <div className="teaching-row-main">
                  <span className="teaching-badge teaching-badge-published">
                    Published
                  </span>
                  <span className="teaching-row-title">{post.title}</span>
                  {post.published_at && (
                    <span className="teaching-row-date">
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="teaching-row-actions">
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => onOpenComposer(post)}>
                    Edit
                  </button>
                  <button
                    className="btn-danger btn-sm"
                    onClick={() => handleDelete(post)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TeachingsTab;
