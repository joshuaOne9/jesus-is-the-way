function Navigation() {
    return (
        <nav className="nav">
            <div className="nav-brand">
                <span className="nav-cross">✝</span>
                <span className="nav-title">Jesus is the Way</span>
            </div>
            <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#gospel">The Gospel</a></li>
                <li><a href="#books">Books of The Bible</a></li>
                <li><a href="#read">Read Scripture</a></li>
                <li><a href="#ask">Ask a Question</a></li>
            </ul>
        </nav>
    )
}

export default Navigation