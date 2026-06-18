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
import Favorites from "./components/Favorites";

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
          <h1>Jesus is the Way</h1>
          <p className="subtitle">
            "I am the way, and the truth, and the life." John 14:6
          </p>
          <p className="description">
            A place to explore Scripture, encounter Jesus, and seek context from
            all books related to The Bible
          </p>
        </div>
      )}

      {currentPage === "gospel" && <Gospel />}
      {currentPage === "read" && <Read />}
      {currentPage === "spiritual-realm" && <Beings user={user} />}
      {currentPage === "ask" && <Ask />}
      {currentPage === "account" && <Auth user={user} />}
      {currentPage === "members" && <Members />}
      {currentPage === "favorites" && <Favorites user={user} />}
      {currentPage === "books" && <Books user={user} />}
      {currentPage === "videos" && <Videos user={user} />}
    </>
  );
}

export default App;
