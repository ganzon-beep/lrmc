import { useState } from 'react'

const profileOptions = [
  { id: 'family', label: 'Moving with family', detail: 'Dependents, documents and family logistics' },
  { id: 'school', label: 'School or childcare', detail: 'Education options and address-dependent planning' },
  { id: 'pets', label: 'Moving with pets', detail: 'Entry sequence, travel and local registration' },
  { id: 'vehicle', label: 'Shipping a vehicle', detail: 'Authorization, VPC preparation and registration' },
  { id: 'housing', label: 'Need housing guidance', detail: 'Temporary lodging and the local housing process' },
]

const appointmentOptions = [
  { id: 'new-federal', label: 'New federal appointment', detail: 'First federal role or returning after a break in service' },
  { id: 'current-federal', label: 'Current federal employee', detail: 'Changing duty station or transferring agencies' },
  { id: 'other', label: 'Another or uncertain path', detail: 'Local-national, contractor, partner or still confirming' },
]

const readProfile = () => {
  try {
    return JSON.parse(localStorage.getItem('lrmc-relocation-profile') || '{}')
  } catch {
    return {}
  }
}

export default function TjoLanding({ onHome, onBuildPlan }) {
  const saved = readProfile()
  const [appointment, setAppointment] = useState(saved.appointment || 'new-federal')
  const [stage, setStage] = useState(saved.stage || 'tjo')
  const [selected, setSelected] = useState(() => new Set(saved.selected || []))

  const toggleOption = (id) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const continueToPlan = () => {
    try {
      localStorage.setItem('lrmc-relocation-profile', JSON.stringify({ appointment, stage, selected: [...selected] }))
    } catch {
      // The pathway remains usable when browser storage is unavailable.
    }
    onBuildPlan()
  }

  return (
    <div className="tjo-shell">
      <header className="institutional-header tjo-header">
        <button className="brand brand-button" onClick={onHome} aria-label="Return to LRMC home">
          <span className="brand-mark">LR</span>
          <span className="brand-copy"><strong>LANDSTUHL</strong><span>Regional Medical Center</span></span>
        </button>
        <p>Your path to LRMC</p>
        <button className="institutional-tjo" onClick={onHome}>Exit pathway <span aria-hidden="true">×</span></button>
      </header>

      <main>
        <section className="tjo-hero section-pad">
          <div className="tjo-hero__copy">
            <p className="eyebrow">Tentative Job Offer</p>
            <h1>You received a TJO.<br /><span>Start here.</span></h1>
            <p>A clear first step for navigating selection, documents, final-offer readiness and an overseas move to LRMC.</p>
          </div>
          <aside className="tjo-caution">
            <span>Before making commitments</span>
            <strong>A TJO is an important milestone—not final travel authorization.</strong>
            <p>Do not resign, relocate, ship property, purchase nonrefundable travel or assume an allowance is approved until your authorized HR or relocation office gives written direction.</p>
          </aside>
        </section>

        <section className="tjo-first-actions section-pad">
          <div className="institutional-section-heading">
            <p className="eyebrow">Focus first</p>
            <h2>Four actions that create clarity.</h2>
          </div>
          <ol>
            <li><span>01</span><div><strong>Review the offer carefully</strong><p>Confirm the position, duty location, grade, appointment details and named HR contact.</p></div></li>
            <li><span>02</span><div><strong>Respond through the instructed channel</strong><p>Meet the deadline and complete only the forms or actions requested by your servicing office.</p></div></li>
            <li><span>03</span><div><strong>Start one document record</strong><p>Keep your offer, identity documents, family records, medical and pet records, official correspondence and later receipts together.</p></div></li>
            <li><span>04</span><div><strong>Ask who owns each next step</strong><p>Clarify which HR, security, passport, travel, transportation and gaining-organization contacts apply to your appointment.</p></div></li>
          </ol>
        </section>

        <section className="tjo-profile section-pad" aria-labelledby="profile-title">
          <div className="tjo-profile__heading">
            <p className="eyebrow">Shape your pathway</p>
            <h2 id="profile-title">Tell us what belongs in your move.</h2>
            <p>Select anything that applies. These choices stay on this device and can be changed later.</p>
          </div>

          <div className="tjo-path-fields">
            <fieldset className="tjo-affiliation">
              <legend>How are you joining LRMC?</legend>
              {appointmentOptions.map((option) => (
                <label key={option.id} className={appointment === option.id ? 'is-selected' : ''}>
                  <input type="radio" name="appointment" value={option.id} checked={appointment === option.id} onChange={(event) => setAppointment(event.target.value)} />
                  <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                </label>
              ))}
            </fieldset>

            <fieldset className="tjo-stage">
              <legend>Where are you now?</legend>
              <label className={stage === 'tjo' ? 'is-selected' : ''}>
                <input type="radio" name="stage" value="tjo" checked={stage === 'tjo'} onChange={(event) => setStage(event.target.value)} />
                <span><strong>I received a TJO</strong><small>Selection and early onboarding</small></span>
              </label>
              <label className={stage === 'fjo' ? 'is-selected' : ''}>
                <input type="radio" name="stage" value="fjo" checked={stage === 'fjo'} onChange={(event) => setStage(event.target.value)} />
                <span><strong>I received my FJO or orders</strong><small>Authorized relocation planning</small></span>
              </label>
              <label className={stage === 'arrival' ? 'is-selected' : ''}>
                <input type="radio" name="stage" value="arrival" checked={stage === 'arrival'} onChange={(event) => setStage(event.target.value)} />
                <span><strong>I have arrived</strong><small>In-processing and first essentials</small></span>
              </label>
            </fieldset>
          </div>

          <fieldset className="tjo-options">
            <legend>What should your plan account for?</legend>
            <div>
              {profileOptions.map((option) => (
                <label key={option.id} className={selected.has(option.id) ? 'is-selected' : ''}>
                  <input type="checkbox" checked={selected.has(option.id)} onChange={() => toggleOption(option.id)} />
                  <span className="tjo-option-check" aria-hidden="true">{selected.has(option.id) ? '✓' : '+'}</span>
                  <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="tjo-profile__action">
            <div><strong>{selected.size + 2}</strong><span>planning details shaping your roadmap</span></div>
            <button className="button button--primary" onClick={continueToPlan}>Build my LRMC plan <span aria-hidden="true">→</span></button>
          </div>
        </section>

        <section className="tjo-boundary section-pad">
          <strong>Unofficial planning companion</strong>
          <p>This pathway does not replace instructions from LRMC, DHA, CPAC, your servicing HR office or another authorized government office. Requirements and entitlements depend on your appointment, orders and individual circumstances.</p>
        </section>
      </main>
    </div>
  )
}
