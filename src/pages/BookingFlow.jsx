import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, Footer, Breadcrumb } from '../components/Nav'
import { packages, COORD_FEE } from '../data/packages'

const STEPS = ['Destination', 'About you', 'Screening', 'Dates', 'Summary']

export default function BookingFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    destination: '',
    packageId: '',
    ageRange: '',
    lastCheckup: '',
    interests: [],
    travellers: 1,
    departDate: '',
    returnDate: '',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const toggleInterest = (v) => set('interests', form.interests.includes(v) ? form.interests.filter(i => i !== v) : [...form.interests, v])

  const selectedPkg = packages.find(p => p.id === form.packageId)
  const total = selectedPkg ? selectedPkg.price * form.travellers + COORD_FEE : 0

  return (
    <div className="site-shell">
      <TopBar />

      <div className="page-header">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Start planning' }]} />
        <h1>Plan your health check holiday</h1>
        <div className="subtitle">Takes about 3 minutes. No payment needed at this stage.</div>
      </div>

      {/* Step bar */}
      <div className="step-bar">
        {STEPS.map((s, i) => (
          <div key={s} className={`step-bar-item ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            {i < step ? `✓ ${s}` : `${i + 1} ${s}`}
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 24px' }}>

        {/* Step 0 — Destination */}
        {step === 0 && (
          <div>
            <div className="inset"><strong>Step 1 of 5 — Choose a destination.</strong> All hospitals on our platform are JCI-accredited. If you have no preference, we can recommend based on your budget and interests.</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Where would you like to go?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['Japan', 'Singapore', 'South Korea', 'Thailand', 'Taiwan', 'Malaysia', 'Hong Kong'].map(d => (
                <label key={d} className="radio-item" style={{ border: form.destination === d ? '2px solid #0d5c4a' : undefined }}>
                  <input type="radio" name="dest" checked={form.destination === d} onChange={() => set('destination', d)} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{d}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{destTagline(d)}</div>
                  </div>
                </label>
              ))}
            </div>
            <StepNav onNext={() => setStep(1)} canNext={!!form.destination} />
          </div>
        )}

        {/* Step 1 — About you */}
        {step === 1 && (
          <div>
            <div className="inset"><strong>Step 2 of 5 — About you.</strong> This helps us match you to the right hospital and screening package. We do not share this with anyone.</div>
            <div className="form-group">
              <label className="form-label">Your age range</label>
              <div className="form-hint">Some screenings are recommended based on age</div>
              {[
                { val: '18–34', hint: 'General wellness, baseline checks' },
                { val: '35–49', hint: 'Cardiovascular, diabetes, cancer markers recommended' },
                { val: '50–64', hint: 'Colonoscopy, bone density, full cancer panel recommended' },
                { val: '65+', hint: 'Comprehensive with physician consultation recommended' },
              ].map(opt => (
                <label key={opt.val} className="radio-item" style={{ border: form.ageRange === opt.val ? '2px solid #0d5c4a' : undefined, marginBottom: 6 }}>
                  <input type="radio" name="age" checked={form.ageRange === opt.val} onChange={() => set('ageRange', opt.val)} />
                  <div>
                    <div>{opt.val}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{opt.hint}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="form-group">
              <label className="form-label">When did you last have a health check?</label>
              <select className="form-select" value={form.lastCheckup} onChange={e => set('lastCheckup', e.target.value)}>
                <option value="">Select…</option>
                <option>Never</option>
                <option>More than 5 years ago</option>
                <option>2–5 years ago</option>
                <option>Within the last 2 years</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Is there anything specific you want to check? (optional)</label>
              <div className="form-hint">Select all that apply</div>
              {['Heart and cardiovascular', 'General cancer screening', 'Diabetes and blood sugar', 'Liver and kidney function', 'Hormones and thyroid'].map(opt => (
                <label key={opt} className="radio-item" style={{ marginBottom: 6 }}>
                  <input type="checkbox" checked={form.interests.includes(opt)} onChange={() => toggleInterest(opt)} />
                  {opt}
                </label>
              ))}
            </div>
            <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} canNext={!!form.ageRange} />
          </div>
        )}

        {/* Step 2 — Screening package */}
        {step === 2 && (
          <div>
            <div className="inset"><strong>Step 3 of 5 — Choose your screening level.</strong> Based on your answers, we recommend Comprehensive. You can change this at any time.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {packages.filter(p => p.destination === form.destination || !form.destination).slice(0, 4).map(pkg => (
                <label key={pkg.id} className="radio-item" style={{ alignItems: 'flex-start', border: form.packageId === pkg.id ? '2px solid #0d5c4a' : undefined }}>
                  <input type="radio" name="pkg" checked={form.packageId === pkg.id} onChange={() => set('packageId', pkg.id)} style={{ marginTop: 4 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{pkg.destination} {capitalize(pkg.tier)} Check</div>
                      <div style={{ fontSize: 16, fontWeight: 500, color: '#0d5c4a', flexShrink: 0, marginLeft: 8 }}>${pkg.price}<span style={{ fontSize: 11, color: '#888', fontWeight: 400 }}>/person</span></div>
                    </div>
                    <div style={{ fontSize: 11, color: '#888', margin: '2px 0 6px' }}>{pkg.city} · {tierDuration(pkg.tier)}</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {pkg.isJci && <span className="tag tag-green">JCI</span>}
                      {pkg.isEnglish && <span className="tag tag-green">English</span>}
                      <span style={{ fontSize: 11, color: '#888' }}>★ {pkg.rating} · {pkg.reviewCount} reviews</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} canNext={!!form.packageId} />
          </div>
        )}

        {/* Step 3 — Dates */}
        {step === 3 && (
          <div>
            <div className="inset"><strong>Step 4 of 5 — Travel dates.</strong> Your hospital slot will be scheduled for day 2 or 3 of your trip. We will confirm the exact time once your booking is placed.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Departure date</label>
                <div className="form-hint">When you fly out from the US</div>
                <input className="form-input" type="date" value={form.departDate} onChange={e => set('departDate', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Return date</label>
                <div className="form-hint">When you fly back to the US</div>
                <input className="form-input" type="date" value={form.returnDate} onChange={e => set('returnDate', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Number of travellers</label>
              <select className="form-select" value={form.travellers} onChange={e => set('travellers', Number(e.target.value))}>
                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
              </select>
            </div>
            <StepNav onBack={() => setStep(2)} onNext={() => setStep(4)} canNext={!!form.departDate && !!form.returnDate} />
          </div>
        )}

        {/* Step 4 — Summary */}
        {step === 4 && (
          <div>
            <div className="inset"><strong>Step 5 of 5 — Review your booking.</strong> No payment is taken now. We will confirm your hospital slot and send a payment link within one business day.</div>

            {selectedPkg && (
              <div style={{ border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ background: selectedPkg.bgColor, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                  {selectedPkg.emoji}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{selectedPkg.destination} {capitalize(selectedPkg.tier)} Health Check</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>{selectedPkg.city} · {selectedPkg.hospitals[0]?.name}</div>

                  {[
                    ['Destination', form.destination],
                    ['Dates', form.departDate && form.returnDate ? `${form.departDate} → ${form.returnDate}` : '—'],
                    ['Travellers', `${form.travellers} ${form.travellers === 1 ? 'person' : 'people'}`],
                    ['Age range', form.ageRange || '—'],
                    ['Last check-up', form.lastCheckup || '—'],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: '0.5px solid rgba(0,0,0,0.07)' }}>
                      <span style={{ color: '#888' }}>{label}</span>
                      <span style={{ fontWeight: 500 }}>{val}</span>
                    </div>
                  ))}

                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', padding: '2px 0' }}>
                      <span>Screening × {form.travellers}</span><span>${selectedPkg.price * form.travellers}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', padding: '2px 0' }}>
                      <span>Coordination fee</span><span>${COORD_FEE}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 500, padding: '8px 0 0', borderTop: '0.5px solid rgba(0,0,0,0.1)', marginTop: 6 }}>
                      <span>Total</span><span style={{ color: '#0d5c4a' }}>${total}</span>
                    </div>
                    <div style={{ background: '#E1F5EE', borderRadius: 8, padding: '8px 10px', marginTop: 10, fontSize: 11, color: '#085041', textAlign: 'center' }}>
                      You save ~${(selectedPkg.usEquivalent * form.travellers - total).toLocaleString()} vs US out-of-pocket
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14 }}
              onClick={() => navigate('/account')}
            >
              Confirm reservation — no payment now
            </button>
            <div style={{ fontSize: 11, color: '#888', textAlign: 'center', marginTop: 8 }}>
              Free cancellation up to 30 days before your trip.
            </div>
            <div style={{ marginTop: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setStep(3)}>← Edit details</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

function StepNav({ onBack, onNext, canNext = true }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
      <button
        className="btn btn-primary"
        onClick={onNext}
        disabled={!canNext}
        style={{ opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'not-allowed' }}
      >
        Save and continue
      </button>
      {onBack && (
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
      )}
    </div>
  )
}

function destTagline(d) {
  const map = {
    Japan: 'World-leading diagnostics · Tokyo & Osaka',
    Singapore: 'English-first · No visa required',
    'South Korea': 'Executive check-ups · Seoul',
    Thailand: 'Best value · Bumrungrad Hospital',
    Taiwan: 'Underrated gem · Taipei',
    Malaysia: 'Most affordable · Kuala Lumpur',
    'Hong Kong': 'Advanced tier · English-speaking',
  }
  return map[d] || ''
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
function tierDuration(t) {
  if (t === 'essential') return '~2 hours'
  if (t === 'comprehensive') return 'Half-day'
  return 'Full day'
}
