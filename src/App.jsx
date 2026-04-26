import { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  return (
    <>
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {currentPage === 'home' && (
      <div className="hero">
        <h1>Jesus is the Way</h1>
        <p className="subtitle">"I am the way, and the truth, and the life." John 14:6</p>
        <p className="description">
          A place to explore Scripture, encounter Jesus, and seek context from all books related to The Bible</p>
      </div>
  )}

  {currentPage === 'gospel' && (
    <div className="page-placeholder">
      <h1>The Gospel</h1>
      <p>Coming soon - the four-point Gospel presentation.</p>
    </div>
    )}

    {currentPage === 'books' && (
      <div className="page-placeholder">
        <h1>Books of The Bible</h1>
        <p>Coming soon - an overview of each book related to The Bible.</p>
      </div>
    )}

    {currentPage === 'read' && (
      <div className="page-placeholder">
        <h1>Read Scripture</h1>
        <p>Coming soon - passage lookup with translation switcher.</p>
      </div>
    )}

    {currentPage === 'ask' && (
      <div className="page-placeholder">
        <h1>Ask a Question</h1>
        <p>Coming soon - AI powered biblical Q&A.</p>
      </div>
    )}
  </>
  )
}

export default App