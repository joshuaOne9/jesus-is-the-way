import { useState, useEffect } from "react";
import { BEINGS, CATEGORY_COLORS } from "../data/beings";
import { BOOKS, GENRE_COLORS } from "../data/books";
import { supabase } from "../lib/supabase";
import { useFavorites } from "../hooks/useFavorites";
import { getYouTubeEmbedUrl } from "../lib/youtube";

function Favorites({ user }) {
  const { favorites, loading, toggleFavorite } = useFavorites(user);
  const [favVideos, setFavVideos] = useState([]);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const videoIds = favorites
      .filter((f) => f.item_type === "video")
      .map((f) => f.item_id);

    if (videoIds.length === 0) {
      setFavVideos([]);
      return;
    }

    async function loadVideos() {
      const { data } = await supabase
        .from("videos")
        .select("*")
        .in("id", videoIds);
      setFavVideos(data || []);
    }

    loadVideos();
  }, [favorites]);

  function toggleCard(key) {
    setActiveKey((prev) => (prev === key ? null : key));
  }

  if (!user) {
    return (
      <section className="page">
        <header className="page-header">
          <p className="page-eyebrow">Account</p>
          <h1>My Favorites</h1>
          <div className="page-divider"></div>
        </header>
        <p>Sign in to save and view your favorites.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="page">
        <p>Loading favorites...</p>
      </section>
    );
  }

  const beingFavorites = favorites
    .filter((f) => f.item_type === "being")
    .map((f) => BEINGS.find((b) => b.name === f.item_id))
    .filter(Boolean);

  const bookFavorites = favorites
    .filter((f) => f.item_type === "book")
    .map((f) => BOOKS.find((b) => b.name === f.item_id))
    .filter(Boolean);

  const nothingSaved =
    beingFavorites.length === 0 &&
    bookFavorites.length === 0 &&
    favVideos.length === 0;

  return (
    <section className="page">
      <header className="page-header">
        <p className="page-eyebrow">Account</p>
        <h1>My Favorites</h1>
        <div className="page-divider"></div>
        <p className="page-intro">
          Everything you've saved. Click any card to open it.
        </p>
      </header>

      {nothingSaved && (
        <p>
          You haven't saved anything yet. Tap the cross on any being, book, or
          video to save it.
        </p>
      )}

      {beingFavorites.length > 0 && (
        <>
          <h2 className="fav-section-title">
            Beings ({beingFavorites.length})
          </h2>
          <div className="books-grid">
            {beingFavorites.map((being) => {
              const key = `being-${being.name}`;
              const isActive = activeKey === key;
              return (
                <div
                  key={key}
                  className={`book-card ${isActive ? "book-active" : ""}`}
                  onClick={() => toggleCard(key)}>
                  <div className="book-card-top">
                    <span
                      className="book-chapters"
                      style={{ background: CATEGORY_COLORS[being.category] }}>
                      {being.category}
                    </span>
                    <button
                      className="fav-btn fav-active"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite("being", being.name);
                      }}
                      aria-label="Remove favorite">
                      ✝
                    </button>
                  </div>
                  <div className="book-name">{being.name}</div>
                  {being.aka && being.aka.length > 0 && (
                    <div className="being-aka">{being.aka.join(" · ")}</div>
                  )}
                  {isActive && (
                    <div className="book-details">
                      <p className="book-summary">{being.description}</p>
                      <div className="meta-label">SCRIPTURE REFERENCE</div>
                      <p className="book-figures">
                        {being.scripture.join(" · ")}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {bookFavorites.length > 0 && (
        <>
          <h2 className="fav-section-title">Books ({bookFavorites.length})</h2>
          <div className="books-grid">
            {bookFavorites.map((book) => {
              const key = `book-${book.name}`;
              const isActive = activeKey === key;
              return (
                <div
                  key={key}
                  className={`book-card ${isActive ? "book-active" : ""}`}
                  onClick={() => toggleCard(key)}>
                  <div className="book-card-top">
                    <span className="book-testament">{book.testament}</span>
                    <span
                      className="book-chapters"
                      style={{ background: GENRE_COLORS[book.genre] }}>
                      {book.chapters} ch
                    </span>
                    <button
                      className="fav-btn fav-active"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite("book", book.name);
                      }}
                      aria-label="Remove favorite">
                      ✝
                    </button>
                  </div>
                  <div className="book-name">{book.name}</div>
                  <div className="book-genre">{book.genre}</div>
                  {isActive && (
                    <div className="book-details">
                      <p className="book-summary">{book.summary}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {favVideos.length > 0 && (
        <>
          <h2 className="fav-section-title">Videos ({favVideos.length})</h2>
          <div className="books-grid">
            {favVideos.map((video) => {
              const key = `video-${video.id}`;
              const isActive = activeKey === key;
              const embedUrl =
                video.source_type === "link"
                  ? getYouTubeEmbedUrl(video.source_url)
                  : null;
              return (
                <div
                  key={key}
                  className={`book-card ${isActive ? "book-active" : ""}`}
                  onClick={() => toggleCard(key)}>
                  <div className="book-card-top">
                    <span className="book-chapters">
                      {video.category || "Video"}
                    </span>
                    <button
                      className="fav-btn fav-active"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite("video", video.id);
                      }}
                      aria-label="Remove favorite">
                      ✝
                    </button>
                  </div>
                  <div className="book-name">{video.title}</div>
                  {isActive && (
                    <div
                      className="book-details"
                      onClick={(e) => e.stopPropagation()}>
                      <div
                        className="video-player"
                        style={{ marginTop: "12px" }}>
                        {embedUrl && (
                          <iframe
                            src={embedUrl}
                            title={video.title}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen></iframe>
                        )}
                        {video.source_type === "file" && (
                          <video
                            controls
                            preload="metadata"
                            src={video.source_url}></video>
                        )}
                      </div>
                      {video.description && (
                        <p className="book-summary">{video.description}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default Favorites;
