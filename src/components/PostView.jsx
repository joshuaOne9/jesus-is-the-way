function PostView({ post, onBack }) {
  const authorName = post.profiles?.display_name || "A teacher";

  return (
    <section className="page post-view">
      <button className="post-back" onClick={onBack}>
        ← Back to teachings
      </button>

      <article className="post-full">
        <header className="post-full-header">
          <h1>{post.title}</h1>
          <div className="post-full-meta">
            <span className="post-full-author">{authorName}</span>
            {post.published_at && (
              <span className="post-full-date">
                {new Date(post.published_at).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </header>

        <div className="post-full-body">{post.body}</div>
      </article>
    </section>
  );
}

export default PostView;
