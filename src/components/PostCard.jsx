function PostCard({ post, onOpen }) {
  const authorName = post.profiles?.display_name || "A teacher";
  // Strip common markdown markers for a clean plain-text preview
  const preview = (post.body || "")
    .replace(/[#*_`>[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);

  return (
    <article className="post-card" onClick={() => onOpen(post)}>
      <div className="post-card-meta">
        <span className="post-card-author">{authorName}</span>
        {post.published_at && (
          <span className="post-card-date">
            {new Date(post.published_at).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )}
      </div>
      <h3 className="post-card-title">{post.title}</h3>
      {preview && (
        <p className="post-card-preview">
          {preview}
          {post.body.length > 220 ? "…" : ""}
        </p>
      )}
      <span className="post-card-readmore">Read teaching →</span>
    </article>
  );
}

export default PostCard;
