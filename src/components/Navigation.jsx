function Navigation({ currentPage, setCurrentPage, user, loading }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "gospel", label: "The Gospel" },
    { id: "books", label: "Books of The Bible" },
    { id: "spiritual-realm", label: "The Spiritual Realm" },
    { id: "read", label: "Read Scripture" },
    { id: "videos", label: "Videos" },
    { id: "members", label: "Community" },
    { id: "ask", label: "Ask a Question" },
  ];

  if (!loading) {
    if (user) {
      links.push({ id: "library", label: "My Library" });
    }
    links.push({ id: "account", label: user ? "Account" : "Sign In" });
  }

  return (
    <nav className="nav">
      <div className="nav-brand">
        <span className="nav-cross">✝</span>
        <span className="nav-title">Jesus is the Way</span>
      </div>
      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.id}>
            <button
              className={currentPage === link.id ? "nav-active" : ""}
              onClick={() => setCurrentPage(link.id)}>
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
