import CareerWorkplace from '../components/CareerWorkplace.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const Arrow = () => <span aria-hidden="true">↗</span>

export default function CareersLrmc({ onHome, onPlan, onLife, onDirectory, onArrival }) {
  return (
    <div className="careers-shell">
      <SiteHeader sectionLabel="Careers" sections={[{ href: '#career-paths', label: 'Career paths' }, { href: '#federal-application', label: 'How to apply' }, { href: '#career-life', label: 'Life at LRMC' }, { href: '#work-culture', label: 'Working here' }, { href: '#first-days', label: 'Your first days' }]} />

      <main>
        <section className="careers-hero">
          <img src={assetUrl('/images/lrmc-entrance.jpg')} alt="Entrance to Landstuhl Regional Medical Center" />
          <div className="careers-hero__overlay" />
          <div className="careers-hero__copy">
            <p className="eyebrow">Careers at LRMC</p>
            <h1>Bring your skill.<br /><span>Serve the mission.</span></h1>
            <p>Join a multidisciplinary community where clinical excellence, professional growth and warfighter readiness converge.</p>
            <div className="hero-actions">
              <a className="button button--primary" href="https://www.usajobs.gov/Search/Results?l=Landstuhl%2C%20Germany" target="_blank" rel="noreferrer">Search USAJOBS <Arrow /></a>
              <a className="text-link" href="#career-paths">Explore career paths <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </section>

        <section className="career-paths section-pad" id="career-paths">
          <div className="section-heading">
            <div><p className="eyebrow">Choose your route</p><h2>Different paths. One purpose.</h2></div>
            <p>Application processes depend on how you hope to serve. Use the official route that matches your employment or commissioning path.</p>
          </div>
          <div className="career-path-grid">
            <article>
              <span>01</span>
              <small>Federal civilian</small>
              <h3>Serve through DHA</h3>
              <p>Federal civilian vacancies at LRMC are announced through USAJOBS. Review each announcement closely for eligibility, qualifications, documents and closing dates.</p>
              <a href="https://www.usajobs.gov/Search/Results?l=Landstuhl%2C%20Germany" target="_blank" rel="noreferrer">View Landstuhl results <Arrow /></a>
            </article>
            <article>
              <span>02</span>
              <small>Clinical professionals</small>
              <h3>Find medical opportunities</h3>
              <p>The Army medical civilian recruiting resource provides a focused route for many clinical vacancies; official announcements remain on USAJOBS.</p>
              <a href="https://civilianmedicaljobs.com" target="_blank" rel="noreferrer">Explore clinical recruiting <Arrow /></a>
            </article>
            <article>
              <span>03</span>
              <small>Uniformed service</small>
              <h3>Army health professions</h3>
              <p>The Landstuhl Medical Recruiting Center provides information about U.S. Army and Army Reserve commissions in health professions.</p>
              <a href="https://landstuhl.tricare.mil/About-Us/Landstuhl-Medical-Recruiting" target="_blank" rel="noreferrer">Visit official recruiting <Arrow /></a>
            </article>
          </div>
        </section>

        <section className="federal-application section-pad" id="federal-application">
          <div className="institutional-section-heading">
            <p className="eyebrow">Federal application path</p>
            <h2>Make every document count.</h2>
          </div>
          <ol className="application-steps">
            <li><span>01</span><div><strong>Search official announcements</strong><p>Use USAJOBS and confirm that the position, agency and duty location match what you intend to pursue.</p></div></li>
            <li><span>02</span><div><strong>Read the full announcement</strong><p>Eligibility, qualifications, required documents and assessment questions can differ for every vacancy.</p></div></li>
            <li><span>03</span><div><strong>Show the required experience</strong><p>Your résumé should clearly demonstrate the specialized experience and competencies described in the announcement.</p></div></li>
            <li><span>04</span><div><strong>Apply through the official system</strong><p>This site does not accept applications. Submit and track your package only through the channel named in the announcement.</p></div></li>
          </ol>
          <div className="application-links">
            <a href="https://www.usajobs.gov/Help/how-to/" target="_blank" rel="noreferrer">USAJOBS application guidance <Arrow /></a>
            <a href="https://dha.mil/About-DHA/Careers?type=all" target="_blank" rel="noreferrer">DHA Careers <Arrow /></a>
          </div>
        </section>

        <section className="career-life section-pad" id="career-life">
          <div className="career-life__copy">
            <p className="eyebrow">Life at LRMC</p>
            <h2>A career shaped by readiness, care and Europe.</h2>
            <p>Practice alongside military and civilian professionals in a forward-stationed environment, develop within a global health enterprise and build a life in the Landstuhl–Kaiserslautern community.</p>
            <button className="text-link" onClick={onLife}>Explore living in Germany <span aria-hidden="true">→</span></button>
          </div>
          <div className="career-benefits">
            <span>Position-dependent possibilities</span>
            <ul>
              <li>Professional and leadership development</li>
              <li>Education and training opportunities</li>
              <li>Federal health, leave and retirement benefits</li>
              <li>Overseas allowances or recruitment incentives when specifically authorized</li>
            </ul>
            <p>Benefits, allowances, incentives and eligibility vary by appointment and announcement. Never assume an entitlement that is not written in your offer or orders.</p>
          </div>
        </section>

        <section className="career-tjo section-pad">
          <p className="eyebrow">Already selected?</p>
          <h2>You received a TJO.<br />Your next path starts here.</h2>
          <p>Move from tentative offer to final offer, relocation, arrival and your first 90 days with an LRMC-focused plan.</p>
          <button className="button button--light" onClick={onPlan}>Open the TJO pathway <span aria-hidden="true">→</span></button>
        </section>

        <CareerWorkplace onPlan={onArrival} onDirectory={onDirectory} onLife={onLife} />

        <section className="institutional-sources careers-sources section-pad">
          <strong>Official application boundary</strong>
          <p>This unofficial site does not collect applications, promise placement or determine eligibility. Current vacancies and application instructions are controlled by the official announcement.</p>
          <div>
            <a href="https://www.usajobs.gov/" target="_blank" rel="noreferrer">USAJOBS <Arrow /></a>
            <a href="https://landstuhl.tricare.mil/About-Us/Landstuhl-Medical-Recruiting" target="_blank" rel="noreferrer">LRMC Medical Recruiting <Arrow /></a>
            <a href="https://dha.mil/About-DHA/Careers?type=all" target="_blank" rel="noreferrer">DHA Careers <Arrow /></a>
          </div>
        </section>
      </main>
    </div>
  )
}
