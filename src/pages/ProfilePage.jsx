import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, Footer, Breadcrumb } from '../components/Nav'
import { mockUser } from '../data/user'

const AGE_RANGES = ['18–34', '35–49', '50–64', '65+']
const LAST_CHECKUP_OPTIONS = ['Within 1 year', '1–2 years ago', '2–5 years ago', '5+ years ago', 'Never']
const INTERESTS = ['Cardiovascular', 'Cancer markers', 'Diabetes', 'Liver function', 'Thyroid & hormones']
const TIERS = ['Essential', 'Comprehensive', 'Advanced']
const DESTINATIONS = ['Japan', 'Singapore', 'South Korea', 'Thailand', 'Taiwan', 'Malaysia', 'Vietnam', 'Hong Kong']

export default function ProfilePage() {
  const navigate = useNavigate()
  const hp = mockUser.healthProfile

  const [form, setForm] = useState({
    firstName: 'Sarah',
    lastName: 'Reynolds',
    email: mockUser.email,
    dob: '1982-04-14',
    nationality: 'US',
    ageRange: hp.ageRange,
    lastCheckup: hp.lastCheckup,
    conditions: hp.conditions === 'None disclosed' ? '' : hp.conditions,
    allergies: hp.allergies,
    medications: '',
    interests: [...hp.interests],
    preferredTier: hp.preferredTier,
    preferredDests: [],
  })

  const [saved, setSaved] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setSaved(false)
  }

  function toggleInterest(interest) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : [...f.interests, interest],
    }))
    setSaved(false)
  }

  function toggleDest(dest) {
    setForm(f => ({
      ...f,
      preferredDests: f.preferredDests.includes(dest)
        ? f.preferredDests.filter(d => d !== dest)
        : [...f.preferredDests, dest],
    }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
  }

  return (
    <div className="site-shell">
      <TopBar />

      <div className="page-header">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'My account', href: '/account' },
          { label: 'Edit profile' },
        ]} />
        <h1>Edit profile</h1>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 24px 48px' }}>

        <div className="inset">
          Your health profile is private. We use it only to match you to the right packages.
          It is never shared.
        </div>

        {/* Section 1: Personal details */}
        <SectionHeading>Personal details</SectionHeading>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">First name</label>
            <input
              className="form-input"
              value={form.firstName}
              onChange={e => set('firstName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last name</label>
            <input
              className="form-input"
              value={form.lastName}
              onChange={e => set('lastName', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input
            className="form-input"
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Date of birth</label>
            <input
              className="form-input"
              type="date"
              value={form.dob}
              onChange={e => set('dob', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nationality</label>
            <select
              className="form-select"
              value={form.nationality}
              onChange={e => set('nationality', e.target.value)}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Section 2: Health background */}
        <SectionHeading>Health background</SectionHeading>

        <div className="form-group">
          <label className="form-label">Age range</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
            {AGE_RANGES.map(range => (
              <label key={range} className="radio-item" style={{ justifyContent: 'center', textAlign: 'center' }}>
                <input
                  type="radio"
                  name="ageRange"
                  value={range}
                  checked={form.ageRange === range}
                  onChange={() => set('ageRange', range)}
                />
                {range}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Last check-up</label>
          <select
            className="form-select"
            value={form.lastCheckup}
            onChange={e => set('lastCheckup', e.target.value)}
          >
            {LAST_CHECKUP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Known conditions <span className="muted small">(optional)</span></label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="E.g. high blood pressure, type 2 diabetes…"
            value={form.conditions}
            onChange={e => set('conditions', e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Allergies <span className="muted small">(optional)</span></label>
          <textarea
            className="form-input"
            rows={2}
            placeholder="E.g. Penicillin, latex…"
            value={form.allergies}
            onChange={e => set('allergies', e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Current medications <span className="muted small">(optional)</span></label>
          <textarea
            className="form-input"
            rows={2}
            placeholder="List any medications you currently take"
            value={form.medications}
            onChange={e => set('medications', e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Section 3: Screening preferences */}
        <SectionHeading>Screening preferences</SectionHeading>

        <div className="form-group">
          <label className="form-label" style={{ marginBottom: 8 }}>Screening interests</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {INTERESTS.map(interest => (
              <label key={interest} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={form.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  style={{ accentColor: 'var(--hch-gold)', width: 15, height: 15 }}
                />
                {interest}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Preferred package tier</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {TIERS.map(tier => (
              <label key={tier} className="radio-item">
                <input
                  type="radio"
                  name="preferredTier"
                  value={tier}
                  checked={form.preferredTier === tier}
                  onChange={() => set('preferredTier', tier)}
                />
                <div>
                  <div style={{ fontWeight: 500 }}>{tier}</div>
                  <div className="muted small">
                    {tier === 'Essential' && '2-hour blood panel, great value'}
                    {tier === 'Comprehensive' && 'Half-day, full blood work + ECG + cancer markers'}
                    {tier === 'Advanced' && 'Full day, MRI/CT included'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ marginBottom: 8 }}>Preferred destinations</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {DESTINATIONS.map(dest => (
              <button
                key={dest}
                type="button"
                className={`chip ${form.preferredDests.includes(dest) ? 'active' : ''}`}
                onClick={() => toggleDest(dest)}
              >
                {dest}
              </button>
            ))}
          </div>
          <div className="form-hint" style={{ marginTop: 6 }}>Select any you'd consider — leave blank for no preference</div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <button className="btn btn-primary" onClick={handleSave}>
            Save profile
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/account')}>
            Cancel
          </button>
          {saved && (
            <span style={{ fontSize: 12, color: '#1D9E75' }}>✓ Profile saved</span>
          )}
        </div>

      </div>

      <Footer />
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <div style={{
      fontSize: 15,
      fontWeight: 500,
      color: '#111',
      margin: '24px 0 14px',
      paddingBottom: 8,
      borderBottom: 'var(--border)',
    }}>
      {children}
    </div>
  )
}
