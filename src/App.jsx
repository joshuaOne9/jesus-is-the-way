import { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import Gospel from "./components/Gospel";
import Books from "./components/Books";
import Read from "./components/Read";
import Ask from "./components/Ask";
import Beings from "./components/Beings";
import Videos from "./components/Videos";
import { useAuth } from "./hooks/useAuth";
import Auth from "./components/Auth";
import ResetPassword from "./components/ResetPassword";
import Members from "./components/Members";
import Library from "./components/Library";
import PostComposer from "./components/PostComposer";
import Feed from "./components/Feed";

function App() {
  const {
    user,
    profile,
    role,
    isLeader,
    isAdmin,
    loading,
    recovering,
    setRecovering,
  } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerPost, setComposerPost] = useState(null); // for editing

  function openComposer(post = null) {
    setComposerPost(post);
    setComposerOpen(true);
  }

  function closeComposer() {
    setComposerOpen(false);
    setComposerPost(null);
  }

  if (recovering) {
    return <ResetPassword onDone={() => setRecovering(false)} />;
  }

  return (
    <>
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        loading={loading}
      />

      <Feed />
      {currentPage === "home" && (
        <>
          <div className="hero">
            <p className="hero-eyebrow">Who Were You</p>
            <h1>- Born to Be! -</h1>
            <div className="hero-verse">
              <p className="hero-verse-text">
                "Then I heard the voice of the Lord saying, 'Whom shall I send?
                And who will go for us?' And I said, 'Here am I. Send me!'"
              </p>
              <p className="hero-verse-ref">Isaiah 6:8</p>
            </div>
            <p className="description">
              A community called to hear, to grow, and to go. Explore Scripture,
              study together, and answer the call.
            </p>
          </div>

          <div className="feed-wrapper">
            <div className="feed-heading">
              <p className="page-eyebrow">The Bulletin</p>
              <h2>Latest Teachings</h2>
              <div className="page-divider"></div>
            </div>
            <Feed />
          </div>
        </>
      )}

      {currentPage === "gospel" && <Gospel />}
      {currentPage === "read" && <Read />}
      {currentPage === "spiritual-realm" && <Beings user={user} />}
      {currentPage === "ask" && <Ask />}
      {currentPage === "account" && <Auth user={user} />}
      {currentPage === "members" && <Members />}
      {currentPage === "library" && (
        <Library
          user={user}
          isLeader={isLeader}
          onOpenComposer={openComposer}
        />
      )}
      {currentPage === "books" && <Books user={user} />}
      {currentPage === "videos" && <Videos user={user} />}

      {isLeader && (
        <PostComposer
          user={user}
          isOpen={composerOpen}
          onClose={closeComposer}
          editingPostId={composerPost?.id ?? null}
          initialPost={composerPost}
        />
      )}
    </>
  );
}

export default App;
