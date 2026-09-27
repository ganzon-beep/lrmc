import { useEffect, useRef, useState } from 'react'
import { submitUpdateSuggestion } from '../services/updateSuggestions.js'

const UPDATE_TYPES = [
  'Phone number',
  'Office hours',
  'Address',
  'Website link',
  'Form or document',
  'Eligibility or policy',
  'Process or instructions',
  'Other',
]

const EMPTY_FORM = {
  name: '',
  email: '',
  organization: '',
  sourceUrl: '',
  pageSection: '',
  updateType: '',
  currentInformation: '',
  proposedInformation: '',
  additionalNotes: '',
  accuracyConfirmed: false,
}
const validateForm = (formData) => {
  const errors = {}
  const email = formData.email.trim()
  const sourceUrl = formData.sourceUrl.trim()

  if (!email) {
    errors.email = 'Enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!sourceUrl) {
    errors.sourceUrl = 'Enter the official source URL.'
  } else if (!sourceUrl.startsWith('https://')) {
    errors.sourceUrl = 'The source URL must begin with https://.'
  } else {
    try {
      const parsedUrl = new URL(sourceUrl)
      if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname) {
        errors.sourceUrl = 'Enter a complete and valid https:// URL.'
      }
    } catch {
      errors.sourceUrl = 'Enter a complete and valid https:// URL.'
    }
  }

  if (!formData.pageSection.trim()) {
    errors.pageSection = 'Identify the page or section that needs updating.'
  }

  if (!formData.proposedInformation.trim()) {
    errors.proposedInformation = 'Enter the proposed replacement information.'
  }

  if (!formData.accuracyConfirmed) {
    errors.accuracyConfirmed = 'Confirm that the submitted information is accurate.'
  }

  return errors
}

function FieldError({ id, message }) {
  if (!message) return null
  return <span className="update-field-error" id={id} role="alert">{message}</span>
}

export default function UpdateSuggestionForm() {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [success, setSuccess] = useState(null)
  const fieldRefs = useRef({})
  const successRef = useRef(null)

  useEffect(() => {
    if (success) successRef.current?.focus()
  }, [success])

  const setFieldRef = (name) => (node) => {
    fieldRefs.current[name] = node
  }

  const updateField = (event) => {
    const { name, type, checked, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }))
    }
    if (submissionError) setSubmissionError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateForm(formData)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      const firstInvalidField = ['email', 'sourceUrl', 'pageSection', 'proposedInformation', 'accuracyConfirmed']
        .find((field) => nextErrors[field])
      fieldRefs.current[firstInvalidField]?.focus()
      return
    }

    setIsSubmitting(true)
    setSubmissionError('')

    try {
      const response = await submitUpdateSuggestion({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        organization: formData.organization.trim(),
        sourceUrl: formData.sourceUrl.trim(),
        pageSection: formData.pageSection.trim(),
        currentInformation: formData.currentInformation.trim(),
        proposedInformation: formData.proposedInformation.trim(),
        additionalNotes: formData.additionalNotes.trim(),
      })
      setFormData(EMPTY_FORM)
      setErrors({})
      setSuccess(response)
    } catch {
      setSubmissionError('We could not submit your update right now. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <section className="update-success" ref={successRef} tabIndex="-1" aria-labelledby="update-success-title">
        <span className="update-success-mark" aria-hidden="true">✓</span>
        <p className="eyebrow">Email draft prepared</p>
        <h2 id="update-success-title">One last step: send the email.</h2>
        <p>Your email app should now be open with the update details filled in. Add the designated site-maintainer address, then press Send. Nothing will be published until it has been verified and approved.</p>
        <div className="update-reference">
          <span>Reference number</span>
          <strong>{success.referenceNumber}</strong>
        </div>
        <div className="update-success-actions">
          <a className="button button--primary" href={success.mailtoUrl}>Open email draft again</a>
          <button className="button button--secondary" onClick={() => setSuccess(null)}>Suggest another update</button>
        </div>
      </section>
    )
  }

  return (
    <form className="update-form" onSubmit={handleSubmit} noValidate>
      <div className="update-form-heading">
        <div>
          <p className="eyebrow">Submission details</p>
          <h2>What needs to change?</h2>
        </div>
        <p><span aria-hidden="true">*</span> Required fields</p>
      </div>

      <div className="update-form-grid">
        <div className="update-field">
          <label htmlFor="update-name">Name</label>
          <input id="update-name" name="name" type="text" autoComplete="name" value={formData.name} onChange={updateField} />
        </div>

        <div className="update-field">
          <label htmlFor="update-email">Email address <span aria-hidden="true">*</span></label>
          <input
            id="update-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={formData.email}
            onChange={updateField}
            ref={setFieldRef('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'update-email-error' : undefined}
            required
          />
          <FieldError id="update-email-error" message={errors.email} />
        </div>

        <div className="update-field">
          <label htmlFor="update-organization">Organization or office name</label>
          <input id="update-organization" name="organization" type="text" autoComplete="organization" value={formData.organization} onChange={updateField} />
        </div>

        <div className="update-field">
          <label htmlFor="update-source-url">Official source URL <span aria-hidden="true">*</span></label>
          <input
            id="update-source-url"
            name="sourceUrl"
            type="url"
            inputMode="url"
            placeholder="https://example.gov/source"
            value={formData.sourceUrl}
            onChange={updateField}
            ref={setFieldRef('sourceUrl')}
            aria-invalid={Boolean(errors.sourceUrl)}
            aria-describedby={errors.sourceUrl ? 'update-source-url-error' : 'update-source-url-hint'}
            required
          />
          <small id="update-source-url-hint">Link directly to the official page, form, or document whenever possible.</small>
          <FieldError id="update-source-url-error" message={errors.sourceUrl} />
        </div>

        <div className="update-field update-field--full">
          <label htmlFor="update-page-section">Page or section that needs updating <span aria-hidden="true">*</span></label>
          <input
            id="update-page-section"
            name="pageSection"
            type="text"
            placeholder="Example: Directory → Pulaski Veterinary Clinic"
            value={formData.pageSection}
            onChange={updateField}
            ref={setFieldRef('pageSection')}
            aria-invalid={Boolean(errors.pageSection)}
            aria-describedby={errors.pageSection ? 'update-page-section-error' : undefined}
            required
          />
          <FieldError id="update-page-section-error" message={errors.pageSection} />
        </div>

        <div className="update-field update-field--full">
          <label htmlFor="update-type">Type of update</label>
          <select id="update-type" name="updateType" value={formData.updateType} onChange={updateField}>
            <option value="">Select an update type</option>
            {UPDATE_TYPES.map((type) => <option value={type} key={type}>{type}</option>)}
          </select>
        </div>

        <div className="update-field update-field--full">
          <label htmlFor="update-current-information">Current information</label>
          <textarea id="update-current-information" name="currentInformation" rows="4" value={formData.currentInformation} onChange={updateField} />
        </div>

        <div className="update-field update-field--full">
          <label htmlFor="update-proposed-information">Proposed replacement information <span aria-hidden="true">*</span></label>
          <textarea
            id="update-proposed-information"
            name="proposedInformation"
            rows="6"
            value={formData.proposedInformation}
            onChange={updateField}
            ref={setFieldRef('proposedInformation')}
            aria-invalid={Boolean(errors.proposedInformation)}
            aria-describedby={errors.proposedInformation ? 'update-proposed-information-error' : undefined}
            required
          />
          <FieldError id="update-proposed-information-error" message={errors.proposedInformation} />
        </div>

        <div className="update-field update-field--full">
          <label htmlFor="update-additional-notes">Additional notes</label>
          <textarea id="update-additional-notes" name="additionalNotes" rows="4" value={formData.additionalNotes} onChange={updateField} />
        </div>
      </div>

      <div className="update-trust-notice">
        <span aria-hidden="true">i</span>
        <p>Submissions are reviewed before publication. Sending an update does not automatically change the website. Please include an official source whenever possible. Your email app will open so you can address, review and send the message.</p>
      </div>

      <div className={`update-confirmation ${errors.accuracyConfirmed ? 'has-error' : ''}`}>
        <label htmlFor="update-accuracy-confirmed">
          <input
            id="update-accuracy-confirmed"
            name="accuracyConfirmed"
            type="checkbox"
            checked={formData.accuracyConfirmed}
            onChange={updateField}
            ref={setFieldRef('accuracyConfirmed')}
            aria-invalid={Boolean(errors.accuracyConfirmed)}
            aria-describedby={errors.accuracyConfirmed ? 'update-accuracy-error' : undefined}
            required
          />
          <span>I confirm that the information submitted is accurate to the best of my knowledge.</span>
        </label>
        <FieldError id="update-accuracy-error" message={errors.accuracyConfirmed} />
      </div>

      {submissionError && <p className="update-submit-error" role="alert">{submissionError}</p>}

      <div className="update-submit-row">
        <button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Preparing…' : 'Prepare update email'}
          {!isSubmitting && <span aria-hidden="true">→</span>}
        </button>
        <p>Add the designated review address and press Send in your email app to complete the suggestion.</p>
      </div>

      <p className="update-email-fallback">
        The permanent LRMC Companion review address will be added before public release. For now, address the prepared message to the project’s designated site maintainer.
      </p>
    </form>
  )
}
