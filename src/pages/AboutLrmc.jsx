const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const Arrow = () => <span aria-hidden="true">↗</span>

export default function AboutLrmc({ onHome, onPlan }) {
  return (
    <div className="institutional-shell">
      <header className="institutional-header">
        <button className="brand brand-button" onClick={onHome} aria-label="Return to LRMC home">
          <span className="brand-mark">LR</span>
          <span className="brand-copy">
            <strong>LANDSTUHL</strong>
            <span>Regional Medical Center</span>
          </span>
        </button>
        <nav aria-label="About LRMC sections">
          <a href="#identity">Who we are</a>
          <a href="#purpose">Mission</a>
          <a href="#legacy">History</a>
          <a href="#command">Leadership &amp; command</a>
        </nav>
        <button className="institutional-tjo" onClick={onPlan}>I have a TJO <span aria-hidden="true">→</span></button>
      </header>

      <nav className="institutional-subnav" aria-label="About LRMC mobile sections">
        <a href="#identity">Who we are</a>
        <a href="#purpose">Mission</a>
        <a href="#legacy">History</a>
        <a href="#command">Leadership &amp; command</a>
      </nav>

      <main>
        <section className="institutional-hero" id="identity">
          <img src={assetUrl('/pictures/2977236532-20120920-A-UR215-140.JPG')} alt="Aerial view of the Landstuhl Regional Medical Center campus" />
          <div className="institutional-hero__overlay" />
          <div className="institutional-hero__copy">
            <p className="eyebrow">Who we are</p>
            <h1>Forward stationed.<br /><span>Globally connected.</span></h1>
            <p>LRMC is a jointly staffed medical center positioned at the intersection of operational readiness, advanced care and enduring partnership.</p>
          </div>
        </section>

        <section className="institutional-facts" aria-label="LRMC at a glance">
          <article><strong>65</strong><span>Beds</span></article>
          <article><strong>52</strong><span>Medical specialties</span></article>
          <article><strong>205K+</strong><span>Beneficiaries across the region</span></article>
          <article><strong>46K+</strong><span>Outpatient visits per month</span></article>
          <p>Figures from LRMC's official About Us profile, last updated September 25, 2023.</p>
        </section>

        <section className="institutional-purpose section-pad" id="purpose">
          <div className="institutional-section-heading">
            <p className="eyebrow">Why we exist</p>
            <h2>A ready medical force for the Joint Warfighter.</h2>
          </div>
          <div className="institutional-purpose__content">
            <p className="institutional-purpose__lead">LRMC sustains medically ready Service Members and resilient families while maintaining an uncompromising focus on high-quality, compassionate and safe patient care.</p>
            <blockquote>
              “Excellence through Teamwork and Selfless Service, forging lasting relationships.”
              <cite>Official LRMC vision</cite>
            </blockquote>
            <a href="https://landstuhl.tricare.mil/About-Us/Mission-and-Vision" target="_blank" rel="noreferrer">Read the official mission and vision <Arrow /></a>
          </div>
        </section>

        <section className="institutional-legacy section-pad" id="legacy">
          <div className="institutional-section-heading">
            <p className="eyebrow">History & legacy</p>
            <h2>Selfless service since 1953.</h2>
          </div>
          <div className="legacy-archive" aria-label="LRMC historical image archive">
            <figure className="legacy-archive__feature">
              <img src={assetUrl('/pictures/1753104965387content.webp')} alt="Historical view of the Landstuhl hospital campus under construction" loading="lazy" />
              <figcaption><span>Building the mission</span><strong>A medical center takes shape on the Kirchberg.</strong></figcaption>
            </figure>
            <figure className="legacy-archive__portrait">
              <img src={assetUrl('/pictures/3665091269.png')} alt="1953 Stars and Stripes newspaper page announcing the dedication of the 320th General Hospital at Landstuhl" loading="lazy" />
              <figcaption><span>April 1953</span><strong>The 320th General Hospital is dedicated.</strong></figcaption>
            </figure>
            <figure>
              <img src={assetUrl('/pictures/72146717-Historic-LRMC-Main-Entrance.jpg')} alt="Historic entrance to the 2nd General Hospital at Landstuhl" loading="lazy" />
              <figcaption><span>2nd General Hospital</span><strong>A front door built around welcome and care.</strong></figcaption>
            </figure>
            <figure>
              <img src={assetUrl('/pictures/2823026810-Gulf-War-Main-2021.jpg')} alt="Military medical teams delivering care during the Gulf War era" loading="lazy" />
              <figcaption><span>Operational medicine</span><strong>Clinical skill carried forward to meet the mission.</strong></figcaption>
            </figure>
            <figure className="legacy-archive__wide">
              <img src={assetUrl('/pictures/2028524233-DSC00026.JPG')} alt="Military medical personnel receiving a patient beside a Red Cross ambulance at Ramstein" loading="lazy" />
              <figcaption><span>Across the continuum</span><strong>Care, movement and humanity in the moments that matter.</strong></figcaption>
            </figure>
          </div>
          <div className="legacy-timeline">
            <article>
              <span>1953</span>
              <div><strong>A hospital takes its post</strong><p>The original 1,000-bed hospital was dedicated as the 320th General Hospital, beginning a lasting medical mission in Germany.</p></div>
            </article>
            <article>
              <span>1994</span>
              <div><strong>LRMC takes its name</strong><p>After serving as the 2nd General Hospital and Landstuhl Army Medical Center, the facility was officially named Landstuhl Regional Medical Center.</p></div>
            </article>
            <article>
              <span>2001+</span>
              <div><strong>A critical link in the evacuation system</strong><p>LRMC's teams cared for wounded, injured and ill U.S. and coalition personnel moving through the aeromedical evacuation system.</p></div>
            </article>
            <article>
              <span>Today</span>
              <div><strong>The mission continues</strong><p>A forward-stationed medical center supporting readiness, families, partners and beneficiaries across three continents.</p></div>
            </article>
          </div>
          <a className="institutional-source-link" href="https://landstuhl.tricare.mil/News-Gallery/Articles/Article/3350887/sole-american-medical-center-in-europe-to-celebrate-70-years" target="_blank" rel="noreferrer">Explore LRMC's official 70-year history <Arrow /></a>
        </section>

        <section className="institutional-command section-pad" id="command">
          <div className="institutional-section-heading">
            <p className="eyebrow">Command team</p>
            <h2>Leadership grounded in service.</h2>
          </div>
          <div className="command-layout">
            <article className="commander-profile">
              <img src={assetUrl('/images/commander-stewart.jpg')} alt="Colonel Warren A. Stewart, LRMC commander" />
              <div>
                <small>Commander</small>
                <h3>Colonel Warren A. Stewart</h3>
                <p>A nurse leader with operational, clinical, recruiting and command experience, Colonel Stewart assumed command of LRMC on June 26, 2025.</p>
                <a href="https://landstuhl.tricare.mil/About-Us/Leadership" target="_blank" rel="noreferrer">Official biography <Arrow /></a>
              </div>
            </article>
            <article className="commander-profile commander-profile--secondary">
              <div className="commander-profile__monogram" aria-hidden="true">JO</div>
              <div>
                <small>Command Sergeant Major</small>
                <h3>Jorge L. Oquendo</h3>
                <p>A senior medical NCO with extensive operational, behavioral health and organizational leadership experience, CSM Oquendo assumed responsibility on August 29, 2024.</p>
                <a href="https://landstuhl.tricare.mil/About-Us/Leadership" target="_blank" rel="noreferrer">Official biography <Arrow /></a>
              </div>
            </article>
          </div>

          <section className="command-themes" aria-labelledby="command-themes-title">
            <div className="command-themes__intro">
              <span>Command in action</span>
              <h3 id="command-themes-title">What current public remarks emphasize.</h3>
              <p>These are attributable themes from Colonel Stewart’s public LRMC remarks in 2026. They provide leadership context without being presented as his formal command philosophy.</p>
            </div>
            <div className="command-themes__grid">
              <article>
                <small>Mission</small>
                <strong>The medical bridge home</strong>
                <p>LRMC’s deployed-warrior teams connect the combat zone, definitive care and families across the evacuation continuum.</p>
                <a href="https://www.dvidshub.net/news/573137/dwmmc-transfers-authority-landstuhl-regional-medical-center" target="_blank" rel="noreferrer">August 2026 remarks <Arrow /></a>
              </article>
              <article>
                <small>Community</small>
                <strong>Families sustain readiness</strong>
                <p>Support for military families reduces pressure at home and strengthens the readiness of those called to serve.</p>
                <a href="https://www.dvidshub.net/news/572530/lrmc-throws-back-school-bash-local-students" target="_blank" rel="noreferrer">August 2026 remarks <Arrow /></a>
              </article>
              <article>
                <small>Team</small>
                <strong>Every person adds capability</strong>
                <p>Adaptability, professional experience and a positive team presence can strengthen the mission from the moment someone arrives.</p>
                <a href="https://www.dvidshub.net/news/569075/honoring-mission-lrmc-recognizes-legacy-plus-soldiers-deployment-concludes" target="_blank" rel="noreferrer">June 2026 remarks <Arrow /></a>
              </article>
            </div>
            <aside className="formal-command-note" aria-label="Formal command philosophy source note">
              <span>Formal command philosophy</span>
              <h3>Authority matters.</h3>
              <p>A complete statement of the commander’s philosophy, priorities and expectations will be published here only when it can be drawn from approved command-team material. Until then, the sourced themes above provide context without speaking on the commander’s behalf.</p>
              <small>Reserved for an approved command statement</small>
            </aside>
          </section>
        </section>

        <section className="institutional-sources section-pad">
          <strong>Source discipline</strong>
          <p>This unofficial page summarizes public LRMC information. Leadership, mission statements and operational figures are time-sensitive; follow the linked official pages for authoritative current information.</p>
          <div>
            <a href="https://landstuhl.tricare.mil/About-Us" target="_blank" rel="noreferrer">LRMC About Us <Arrow /></a>
            <a href="https://landstuhl.tricare.mil/About-Us/Leadership" target="_blank" rel="noreferrer">Official Leadership <Arrow /></a>
            <a href="https://dha.mil/About-DHA/Combat-Support-Agency" target="_blank" rel="noreferrer">DHA Combat Support Agency <Arrow /></a>
          </div>
        </section>
      </main>
    </div>
  )
}
