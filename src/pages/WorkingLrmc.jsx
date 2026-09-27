const Arrow = () => <span aria-hidden="true">↗</span>
const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

export default function WorkingLrmc({ onHome, onPlan, onDirectory, onLife }) {
  return (
    <div className="work-shell">
      <header className="institutional-header work-header">
        <button className="brand brand-button" onClick={onHome} aria-label="Return to LRMC home">
          <span className="brand-mark">LR</span>
          <span className="brand-copy"><strong>LANDSTUHL</strong><span>Regional Medical Center</span></span>
        </button>
        <nav aria-label="Working at LRMC sections">
          <a href="#work-culture">The mission</a>
          <a href="#first-days">Your first days</a>
          <a href="#readiness-at-work">Readiness</a>
          <a href="#work-resources">Resources</a>
        </nav>
        <button className="institutional-tjo" onClick={onPlan}>Open my plan <span aria-hidden="true">→</span></button>
      </header>

      <nav className="institutional-subnav" aria-label="Working at LRMC mobile sections">
        <a href="#work-culture">The mission</a>
        <a href="#first-days">Your first days</a>
        <a href="#readiness-at-work">Readiness</a>
        <a href="#work-resources">Resources</a>
      </nav>

      <main>
        <section className="work-hero" id="work-culture">
          <div className="work-hero__copy">
            <p className="eyebrow">Working at LRMC</p>
            <h1>Your work begins<br /><span>with the mission.</span></h1>
            <p>Selfless service is the center of gravity: a shared commitment to the patient, the team and readiness before the moment arrives.</p>
            <div>
              <button className="button button--primary" onClick={onPlan}>Open my LRMC plan <span aria-hidden="true">→</span></button>
              <a href="https://landstuhl.tricare.mil/About-Us/Hospital-Education-and-Training-Division" target="_blank" rel="noreferrer">Education & training <Arrow /></a>
            </div>
          </div>
          <figure className="work-hero__image">
            <img src={assetUrl('/pictures/2512349863-ds.png')} alt="Service members working together in an operational environment" />
            <figcaption><span>Selfless service</span><strong>Care for the force. Readiness for the mission.</strong></figcaption>
          </figure>
        </section>

        <section className="work-principles" aria-label="LRMC workplace principles">
          <article><span>01</span><div><strong>Teamwork</strong><p>Joint, civilian, local-national and partner expertise aligned around the mission.</p></div></article>
          <article><span>02</span><div><strong>Readiness</strong><p>Knowledge, repetition and clinical proficiency developed before they are needed.</p></div></article>
          <article><span>03</span><div><strong>Human care</strong><p>Safe, compassionate care grounded in dignity, trust and accountability.</p></div></article>
        </section>

        <section className="work-onboarding section-pad" id="first-days">
          <div className="institutional-section-heading">
            <p className="eyebrow">Your first days</p>
            <h2>Arrive ready to learn the team.</h2>
          </div>
          <div className="work-onboarding__layout">
            <ol>
              <li><span>01</span><div><strong>Confirm where and when to report</strong><p>Use the reporting instructions from your supervisor, sponsor or authorized onboarding contact. Bring the documents they specifically request.</p></div></li>
              <li><span>02</span><div><strong>Complete hospital orientation</strong><p>Hospital Newcomer Orientation introduces the LRMC mission, leadership and hospital-wide requirements.</p></div></li>
              <li><span>03</span><div><strong>Begin unit orientation</strong><p>Your section translates the larger mission into local workflows, role-specific competencies and standards of practice.</p></div></li>
              <li><span>04</span><div><strong>Own your readiness record</strong><p>Licensure, certifications, competencies and mandatory training vary by role and status. Confirm exactly what your unit requires and how it is recorded.</p></div></li>
            </ol>
            <aside>
              <p className="eyebrow">Bring into focus</p>
              <h3>Five things for a clearer start.</h3>
              <ul>
                <li>Government ID and reporting instructions</li>
                <li>Orders or final-offer documents, when applicable</li>
                <li>Current licenses and certifications requested for your role</li>
                <li>Your supervisor or sponsor’s contact information</li>
                <li>A written list of access, payroll and onboarding questions</li>
              </ul>
              <small>Your official instructions control. This list is a planning aid, not a reporting checklist.</small>
            </aside>
          </div>
        </section>

        <section className="work-readiness section-pad" id="readiness-at-work">
          <div className="work-readiness__heading">
            <p className="eyebrow">Readiness at work</p>
            <h2>Ready before the call.</h2>
            <p>At LRMC, education is part of operational capability. Training supports clinical judgment, team performance and the skills required to care for patients in routine and high-pressure environments.</p>
          </div>
          <div className="work-readiness__grid">
            <article><span>Learn</span><h3>Hospital and unit orientation</h3><p>Build context for the organization, then translate it into the standards and competencies of your role.</p></article>
            <article><span>Practice</span><h3>Simulation and life support</h3><p>Realistic repetition strengthens communication, decision-making and clinical response across teams.</p></article>
            <article><span>Sustain</span><h3>Professional development</h3><p>Continuing education, specialty courses and leadership development help keep the force capable.</p></article>
            <article><span>Account</span><h3>Role-specific requirements</h3><p>Training, certification and readiness obligations differ by service, status, specialty and assignment.</p></article>
          </div>
          <a className="work-source-link" href="https://landstuhl.tricare.mil/About-Us/Hospital-Education-and-Training-Division" target="_blank" rel="noreferrer">Explore LRMC Hospital Education & Training <Arrow /></a>
        </section>

        <section className="work-resources section-pad" id="work-resources">
          <div>
            <p className="eyebrow">Keep moving</p>
            <h2>Mission and life connect here.</h2>
            <p>Your first weeks are both professional and personal. Keep the workday, arrival requirements and life in the surrounding community connected in one plan.</p>
          </div>
          <div className="work-resource-actions">
            <button onClick={onPlan}><span>Your LRMC plan</span><strong>Arrival and in-processing</strong><i>→</i></button>
            <button onClick={onDirectory}><span>Find the right office</span><strong>LRMC and KMC directory</strong><i>→</i></button>
            <button onClick={onLife}><span>Beyond the workday</span><strong>Living near Landstuhl</strong><i>→</i></button>
            <a href="https://landstuhl.tricare.mil/Portals/134/LRMC%20Welcome%20Packet%20%20OCT%2021.pdf" target="_blank" rel="noreferrer"><span>Official reference</span><strong>LRMC welcome packet</strong><i>↗</i></a>
          </div>
        </section>

        <section className="tjo-boundary section-pad">
          <strong>Unofficial workforce companion</strong>
          <p>Reporting instructions, access, credentials, training and unit requirements change and depend on your role. Follow current direction from your supervisor, sponsor, HR office, service component and authorized LRMC offices.</p>
        </section>
      </main>
    </div>
  )
}
