'use client'

import { useState } from 'react'
import { ArrowUpRight, Clock3, Menu, X } from 'lucide-react'

const chapters = [
  { time: '06:00', title: 'First light', text: 'The city wakes up. What do we put on before anyone is watching?' },
  { time: '10:00', title: 'On the clock', text: 'Workwear, uniforms, codes, and the clothes that open doors.' },
  { time: '15:00', title: 'The in-between', text: 'A live exchange on status, belonging, and what we choose to keep.' },
  { time: '21:00', title: 'After hours', text: 'Music, movement, repair, and the return to a self that is yours.' },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Corporate Avatar home">
          <span className="wordmark-mark" aria-hidden="true">CA</span>
          <span>Corporate<br />Avatar</span>
        </a>
        <nav className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'} aria-label="Main navigation">
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#program" onClick={() => setMenuOpen(false)}>Program</a>
          <a href="#participate" onClick={() => setMenuOpen(false)}>Participate</a>
          <a href="#archive" onClick={() => setMenuOpen(false)}>Archive</a>
        </nav>
        <a className="header-cta" href="mailto:edidirect@edimassive.com">Get involved <ArrowUpRight size={15} /></a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A 24-hour New York experience / 001</p>
          <h1>Who are you<br /><em>off duty?</em></h1>
          <p className="hero-intro">A living conversation about clothing, identity, work, culture, and the parts of ourselves that do not clock out.</p>
          <a className="button button-dark" href="#experience">Explore the experience <ArrowUpRight size={16} /></a>
        </div>
        <div className="hero-art" aria-label="Abstract fabric sculpture" role="img">
          <div className="art-grid" aria-hidden="true" />
          <div className="fabric-ring fabric-ring-one" />
          <div className="fabric-ring fabric-ring-two" />
          <div className="fabric-fold" />
          <div className="art-stamp" aria-hidden="true"><span>24</span><small>hours<br />in motion</small></div>
          <p className="art-caption">A study in<br />soft power</p>
        </div>
        <div className="hero-signal" aria-hidden="true"><span>On air</span><i /><span>NYC / 001</span></div>
        <div className="hero-footer">
          <span>New York City</span><span>Dates to be announced</span><span>In person + broadcast</span>
        </div>
      </section>

      <section className="statement-section" id="experience">
        <p className="section-number">01 / The premise</p>
        <div className="statement-grid">
          <h2>You need clothes<br /><span>for life.</span></h2>
          <div className="statement-text"><p>Corporate Avatar: Off Duty is a continuous 24-hour experience moving through the wardrobe of a day—and the many identities we wear inside it.</p><p>From the first uniform to the last layer, we ask what clothing communicates, who gets to decide, and what becomes possible when we dress for more than work.</p></div>
        </div>
      </section>

      <section className="program-section" id="program">
        <div className="program-heading"><p className="section-number">02 / The program</p><h2>One day.<br /><em>Many selves.</em></h2><p className="program-note">Four chapters. One city. A rotating cast of makers, thinkers, workers, and wearers.</p></div>
        <div className="chapter-list">{chapters.map((chapter) => <article className="chapter" key={chapter.time}><div className="chapter-time"><Clock3 size={15} />{chapter.time}</div><h3>{chapter.title}</h3><p>{chapter.text}</p><ArrowUpRight size={18} className="chapter-arrow" /></article>)}</div>
      </section>

      <section className="participate-section" id="participate">
        <div><p className="section-number">03 / Join the conversation</p><h2>Bring your<br /><em>whole self.</em></h2></div>
        <div className="participate-copy"><p>We are looking for people who have something real to say about the clothes they wear, make, alter, inherit, question, and live in.</p><a className="button button-light" href="mailto:edidirect@edimassive.com">Start a conversation <ArrowUpRight size={16} /></a></div>
      </section>

      <section className="archive-section" id="archive"><div className="archive-label"><p className="section-number">04 / Public archive</p><p>Selected notes from the making of Corporate Avatar: Off Duty.</p></div><div className="archive-cards"><a href="https://www.goodheartapp.com/" target="_blank" rel="noreferrer" className="archive-card archive-card-large"><span>Field note / 001</span><h3>What does it mean to be dressed for the job?</h3><ArrowUpRight size={18} /></a><a href="https://www.goodheartapp.com/" target="_blank" rel="noreferrer" className="archive-card"><span>In partnership with</span><h3>GoodHeart</h3><p>A fashion-technology platform exploring better ways to understand, use, maintain, and recirculate what we already own.</p><ArrowUpRight size={18} /></a></div></section>

      <footer className="site-footer"><div className="footer-brand">Corporate Avatar<br /><span>Off Duty</span></div><div className="footer-links"><a href="mailto:edidirect@edimassive.com">Contact</a><a href="https://www.goodheartapp.com/" target="_blank" rel="noreferrer">GoodHeart</a><a href="#top">Back to top ↑</a></div><p>© 2026 DMT Outfitters LLC</p></footer>
    </main>
  )
}
