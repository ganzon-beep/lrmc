import { useEffect, useRef, useState } from 'react'

const groups = [
  ['About LRMC & Our Mission', [['About LRMC & our mission', 'about-lrmc']]],
  ['Careers', [['Careers at LRMC', 'careers-lrmc']]],
  ['Life & Relocation', [['Life in Germany', 'life'], ['Vehicle', 'vehicle'], ['Pets', 'pets'], ['Household goods', 'household-goods'], ['Pay & allowances', 'allowances']]],
  ['Resources', [['Services & offices', 'directory'], ['Official links', 'links'], ['Suggest an update', 'suggest-update']]],
]

export default function SiteHeader({ sections = [], sectionLabel = 'Page' }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const toggle = useRef(null)
  useEffect(() => {
    const close = () => setOpen(false)
    const escape = (event) => {
      if (event.key === 'Escape' && open) { close(); toggle.current?.focus() }
    }
    const outside = (event) => { if (!root.current?.contains(event.target)) close() }
    window.addEventListener('hashchange', close)
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    return () => {
      window.removeEventListener('hashchange', close)
      document.removeEventListener('keydown', escape)
      document.removeEventListener('pointerdown', outside)
    }
  }, [open])
  return (
    <header className="lrmc-header" ref={root} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
    }}>
      <a className="brand" href="#top" onClick={() => { setOpen(false); window.scrollTo(0, 0) }} aria-label="LRMC home">
        <span className="brand-mark">LR</span>
        <span className="brand-copy"><strong>LANDSTUHL</strong><span>Regional Medical Center</span></span>
      </a>
      {sections.length > 0 && <nav className="lrmc-section-links" aria-label={`${sectionLabel} page sections`}>
        {sections.map(({ href, label }) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>}
      <div className="lrmc-header-actions">
      <a className="lrmc-home" href="#top" aria-label="Home" title="Home" onClick={() => { setOpen(false); window.scrollTo(0, 0) }}>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" /></svg>
      </a>
      <button className="lrmc-menu-toggle" ref={toggle} aria-expanded={open} aria-controls="lrmc-navigation" onClick={() => setOpen(!open)}>
        <span aria-hidden="true">{open ? '✕' : '☰'}</span> {open ? 'Close' : 'Menu'}
      </button>
      </div>
      {open && <nav className="lrmc-navigation" id="lrmc-navigation" aria-label="Primary navigation">
        <a href="#top" onClick={() => setOpen(false)}>Home</a>
        <div className="lrmc-navigation-groups">
          {groups.map(([title, links]) => <section key={title}>
            <h2>{title}</h2>
            {links.map(([label, target]) => <a key={target} href={`#${target}`} onClick={() => { setOpen(false); window.scrollTo(0, 0) }} aria-current={window.location.hash === `#${target}` ? 'page' : undefined}>{label}</a>)}
          </section>)}
        </div>
        <button className="lrmc-install" onClick={() => { setOpen(false); window.dispatchEvent(new Event('open-pwa-install')) }}>Install the app</button>
      </nav>}
    </header>
  )
}
