const GOSPEL_POINTS = [
  {
    number: '1',
    title: 'God is Holy',
    text: 'God is perfect, just, and holy. He created humanity in His image for relationship with Him — to know Him and reflect His glory in the world.',
  },
  {
    number: '2',
    title: 'Man is Sinful',
    text: 'All of us have sinned and fallen short of God\'s glory (Romans 3:23). Sin separates us from God and carries a consequence: death (Romans 6:23).',
  },
  {
    number: '3',
    title: 'Christ is the Solution',
    text: 'God, in His love, sent His Son Jesus to live the life we couldn\'t live and die the death we deserved. He bore our sin on the cross and satisfied God\'s perfect justice.',
  },
  {
    number: '4',
    title: 'We Must Respond',
    text: 'Repent — turn from sin — and believe in the Lord Jesus Christ. Confess with your mouth and believe in your heart, and you will be saved (Romans 10:9).',
  },
]

const TEACHINGS = [
  {
    ref: 'Matthew 5–7',
    title: 'The Sermon on the Mount',
    summary: 'The greatest sermon ever preached — the Beatitudes, the Lord\'s Prayer, love your enemies, and build your life on the rock.',
  },
  {
    ref: 'Matthew 22:37–39',
    title: 'The Great Commandment',
    summary: 'Love the Lord your God with all your heart, soul, and mind — and love your neighbor as yourself. All the Law hangs on these two.',
  },
  {
    ref: 'Matthew 28:19–20',
    title: 'The Great Commission',
    summary: 'Go and make disciples of all nations, baptizing and teaching them. He is with us always, even to the end of the age.',
  },
  {
    ref: 'John 3:3–16',
    title: 'You Must Be Born Again',
    summary: 'Nicodemus hears the Gospel in full — flesh gives birth to flesh, the Spirit gives birth to spirit. God so loved the world that He gave His only Son.',
  },
  {
    ref: 'John 14:6',
    title: 'I Am the Way',
    summary: 'Jesus declares Himself the only path to the Father — not a way among many, but the Way, the Truth, and the Life.',
  },
  {
    ref: 'Luke 15:11–32',
    title: 'The Prodigal Son',
    summary: 'A father runs to his returning son — the defining image of God\'s heart toward repentant sinners. Heaven rejoices over one who returns.',
  },
  {
    ref: 'Luke 22:19–20',
    title: 'The Last Supper',
    summary: 'Jesus institutes Communion — His body broken and blood shed establish the New Covenant for the forgiveness of sins.',
  },
  {
    ref: 'John 20; 1 Corinthians 15',
    title: 'The Resurrection',
    summary: 'On the third day He rose. The resurrection is the cornerstone of all Christian faith — if Christ is not raised, faith is futile. But He is risen.',
  },
]

function Gospel() {
  return (
    <section className="page gospel">
      <header className="page-header">
        <p className="page-eyebrow">The Good News</p>
        <h1>Jesus Christ — Who He Is</h1>
        <div className="page-divider"></div>
        <p className="page-intro">
          Jesus of Nazareth is the eternal Son of God — fully God and fully man — who entered human history to seek and save the lost. He lived a sinless life, died on the cross as the atoning sacrifice for the sins of all humanity, rose bodily from the dead on the third day, and ascended to the right hand of the Father. He is coming again.
        </p>
      </header>

      <div className="card four-points">
        <h2>The Gospel in Four Points</h2>
        {GOSPEL_POINTS.map((point) => (
          <div key={point.number} className="point">
            <div className="point-title">{point.number}. {point.title}</div>
            <p>{point.text}</p>
          </div>
        ))}
        <div className="verse-callout">
          "For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life." — John 3:16
        </div>
      </div>

      <h2 className="section-heading">Key Teachings of Jesus</h2>
      <div className="teachings-grid">
        {TEACHINGS.map((teaching) => (
          <div key={teaching.title} className="teaching-card">
            <div className="teaching-ref">{teaching.ref}</div>
            <h3>{teaching.title}</h3>
            <p>{teaching.summary}</p>
          </div>
        ))}
      </div>

      <div className="prayer-block">
        <h2>Ready to Receive Christ?</h2>
        <p className="prayer-intro">
          Salvation is not about a perfect prayer — it is about sincere faith. If you believe in your heart and are ready to surrender your life to Jesus, you can pray something like this:
        </p>
        <div className="prayer-card">
          "Lord Jesus, I know I am a sinner. I believe You died for my sins and rose from the dead. I turn from my sin and invite You into my life as my Lord and Savior. Thank You for forgiving me and giving me eternal life. Amen."
        </div>
      </div>
    </section>
  )
}

export default Gospel