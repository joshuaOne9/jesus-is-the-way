import { useState } from "react";
import { usePosts } from "../hooks/usePosts";
import PostCard from "./PostCard";
import PostView from "./PostView";

function Feed() {
  const { posts, loading, error } = usePosts();
  const [openPost, setOpenPost] = useState(null);

  if (openPost) {
    return <PostView post={openPost} onBack={() => setOpenPost(null)} />;
  }

  return (
    <section className="feed">
      {loading && <p className="feed-status">Loading teachings…</p>}

      {error && <p className="feed-status">Couldn't load teachings.</p>}

      {!loading && posts.length === 0 && (
        <p className="feed-status feed-empty">
          No teachings have been shared yet. Check back soon.
        </p>
      )}

      {posts.length > 0 && (
        <div className="feed-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onOpen={setOpenPost} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Feed;
