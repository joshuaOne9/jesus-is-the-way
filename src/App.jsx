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

function App() {
  const { user, loading, recovering, setRecovering } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");

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

      {currentPage === "home" && (
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
      )}

      {currentPage === "gospel" && <Gospel />}
      {currentPage === "read" && <Read />}
      {currentPage === "spiritual-realm" && <Beings user={user} />}
      {currentPage === "ask" && <Ask />}
      {currentPage === "account" && <Auth user={user} />}
      {currentPage === "members" && <Members />}
      {currentPage === "library" && <Library user={user} />}
      {currentPage === "books" && <Books user={user} />}
      {currentPage === "videos" && <Videos user={user} />}
    </>
  );
}

export default App;
