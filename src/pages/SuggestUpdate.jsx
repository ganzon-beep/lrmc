import SiteHeader from '../components/SiteHeader.jsx'
import UpdateSuggestionForm from '../components/UpdateSuggestionForm.jsx'

export default function SuggestUpdate({ onHome, onDirectory }) {
  return (
    <div className="companion-shell suggestion-shell">
      <SiteHeader />

      <main className="suggestion-main">
        <section className="suggestion-hero">
          <div>
            <p className="eyebrow">Suggest an update</p>
            <h1>Help keep the<br /><span>companion current.</span></h1>
          </div>
          <p>Share a correction, new official source, or changed process for review. The form prepares a structured email—it never edits the site automatically.</p>
        </section>

        <section className="suggestion-layout">
          <aside className="suggestion-process" aria-labelledby="suggestion-process-title">
            <p className="eyebrow">What happens next</p>
            <h2 id="suggestion-process-title">Reviewed by a person.<br />Published only when verified.</h2>
            <ol>
              <li><span>01</span><div><strong>You prepare</strong><p>Provide the proposed change and its official source, then send the prepared email.</p></div></li>
              <li><span>02</span><div><strong>We verify</strong><p>The information is checked for authority, accuracy, and relevance.</p></div></li>
              <li><span>03</span><div><strong>Then we decide</strong><p>Only an approved update may be incorporated into a later site release.</p></div></li>
            </ol>
            <p className="suggestion-privacy-note"><strong>Email-based review:</strong> the site does not store your submission. Your email app opens a prepared message so you can address it to the designated site maintainer.</p>
          </aside>

          <UpdateSuggestionForm />
        </section>
      </main>
    </div>
  )
}
