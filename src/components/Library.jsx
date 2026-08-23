import { useState } from "react";
import FavoritesTab from "./library/FavoritesTab";
import CategoriesTab from "./library/CategoriesTab";
import JournalTab from "./library/JournalTab";
import TeachingsTab from "./library/TeachingsTab";

function Library({ user, isLeader, onOpenComposer }) {
  const [activeTab, setActiveTab] = useState("favorites");

  if (!user) {
    return (
      <section className="page">
        <header className="page-header">
          <p className="page-eyebrow">Account</p>
          <h1>My Library</h1>
          <div className="page-divider"></div>
        </header>
        <p>Sign in to access your favorites, highlights, and journal.</p>
      </section>
    );
  }

  return (
    <section className="page library-page">
      <header className="page-header">
        <p className="page-eyebrow">Account</p>
        <h1>My Library</h1>
        <div className="page-divider"></div>
      </header>

      <nav className="library-tabs" aria-label="Library sections">
        <button
          className={`library-tab ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}>
          Favorites
        </button>
        <button
          className={`library-tab ${activeTab === "journal" ? "active" : ""}`}
          onClick={() => setActiveTab("journal")}>
          Journal
        </button>
        <button
          className={`library-tab ${activeTab === "highlights" ? "active" : ""}`}
          onClick={() => setActiveTab("highlights")}>
          Highlights & Notes
        </button>
        <button
          className={`library-tab ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}>
          Categories
        </button>
        {isLeader && (
          <button
            className={`library-tab ${activeTab === "teachings" ? "active" : ""}`}
            onClick={() => setActiveTab("teachings")}>
            My Teachings
          </button>
        )}
      </nav>

      <div className="library-content">
        {activeTab === "favorites" && <FavoritesTab user={user} />}
        {activeTab === "highlights" && (
          <p className="library-coming-soon">
            Coming soon — browse all your highlights and notes across every book
            you've marked.
          </p>
        )}
        {activeTab === "journal" && <JournalTab user={user} />}
        {activeTab === "categories" && <CategoriesTab user={user} />}
        {activeTab === "teachings" && isLeader && (
          <TeachingsTab user={user} onOpenComposer={onOpenComposer} />
        )}
      </div>
    </section>
  );
}

export default Library;
