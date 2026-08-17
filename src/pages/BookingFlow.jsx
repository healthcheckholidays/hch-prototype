import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, Footer, Breadcrumb } from '../components/Nav'
import { PersistentSidebar } from '../components/PersistentSidebar'
import { COORD_FEE } from '../data/packages'
import { supabase } from '../lib/supabase'
import {
  COUNTRIES,
  PREP_INSTRUCTIONS,
  INTEREST_CATEGORIES,
  COMPLIANCE_ITEMS,
  buildItineraryPreview,
} from '../data/bookingFlowData'

const STEP_LABELS = ['Country', 'Clinic', 'Package', 'Prepare', 'Journey', 'Interests', 'Itinerary', 'Your info', 'Payment']

export default function BookingFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })

  const [form, setForm] = useState({
    countryId: '',
    clinicId: '',
    packageId: '',
    wantsLeisure: null,
    interests: [],
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    compliance: { fasting: false, consent: false, accuracy: false },
  })

  // ── Supabase-backed data ────────────────────────────────────────────────
  const [clinics, setClinics] = useState([])
  const [clinicsLoading, setClinicsLoading] = useState(true)
  const [clinicsError, setClinicsError] = useState(null)
  const [clinicsRetry, setClinicsRetry] = useState(0)

  const [packageOptions, setPackageOptions] = useState([])
  const [packagesLoading, setPackagesLoading] = useState(false)
  const [packagesError, setPackagesError] = useState(null)
  const [packagesRetry, setPackagesRetry] = useState(0)

  const [packageDetail, setPackageDetail] = useState(null)
  const [standardTests, setStandardTests] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)
  const [detailRetry, setDetailRetry] = useState(0)

  // Fetch Japan clinics once on mount (retryable).
  useEffect(() => {
    let cancelled = false
    setClinicsLoading(true)
    setClinicsError(null)
    supabase
      .from('hospitals')
      .select('*')
      .eq('country_code', 'JP')
      .eq('active', true)
      .order('name')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setClinicsError(error.message)
          setClinicsLoading(false)
          return
        }
        setClinics(data || [])
        setClinicsLoading(false)
      })
    return () => { cancelled = true }
  }, [clinicsRetry])

  // Fetch packages whenever the selected clinic changes.
  useEffect(() => {
    if (!form.clinicId) {
      setPackageOptions([])
      return
    }
    let cancelled = false
    setPackagesLoading(true)
    setPackagesError(null)
    supabase
      .from('packages')
      .select('*')
      .eq('hospital_id', form.clinicId)
      .eq('active', true)
      .order('price_usd')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setPackagesError(error.message)
          setPackagesLoading(false)
          return
        }
        setPackageOptions(data || [])
        setPackagesLoading(false)
      })
    return () => { cancelled = true }
  }, [form.clinicId, packagesRetry])

  // Fetch full package details + its included tests whenever a package is selected.
  useEffect(() => {
    if (!form.packageId) {
      setPackageDetail(null)
      setStandardTests([])
      return
    }
    let cancelled = false
    setDetailLoading(true)
    setDetailError(null)
    Promise.all([
      supabase.from('packages').select('*').eq('id', form.packageId).single(),
      supabase.from('tests').select('*').eq('is_standard', true).order('category'),
    ]).then(([pkgRes, testsRes]) => {
      if (cancelled) return
      if (pkgRes.error) {
        setDetailError(pkgRes.error.message)
        setDetailLoading(false)
        return
      }
      if (testsRes.error) {
        setDetailError(testsRes.error.message)
        setDetailLoading(false)
        return
      }
      setPackageDetail(pkgRes.data)
      setStandardTests(testsRes.data || [])
      setDetailLoading(false)
    })
    return () => { cancelled = true }
  }, [form.packageId, detailRetry])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  function selectClinic(clinicId) {
    setForm(f => ({ ...f, clinicId, packageId: '' }))
  }

  function toggleInterest(id) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id) ? f.interests.filter(i => i !== id) : [...f.interests, id],
    }))
  }

  function toggleCompliance(id) {
    setForm(f => ({ ...f, compliance: { ...f.compliance, [id]: !f.compliance[id] } }))
  }

  const selectedClinic = clinics.find(c => c.id === form.clinicId)
  const selectedPackageOption = packageOptions.find(p => p.id === form.packageId) || null
  const activePackage = packageDetail || selectedPackageOption
  const total = activePackage ? activePackage.price_usd + COORD_FEE : 0

  const itineraryPreview = useMemo(
    () => buildItineraryPreview(form.interests),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.interests.join(',')]
  )

  function goNext() {
    if (step === 4) {
      setStep(form.wantsLeisure ? 5 : 7)
    } else {
      setStep(s => s + 1)
    }
  }

  function goBack() {
    if (step === 7 && form.wantsLeisure === false) {
      setStep(4)
    } else {
      setStep(s => s - 1)
    }
  }

  const canProceedLead =
    form.leadName.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(form.leadEmail) &&
    COMPLIANCE_ITEMS.every(c => form.compliance[c.id])

  const canPay = card.number.trim() && card.expiry.trim() && card.cvc.trim() && card.name.trim()

  function handlePay() {
    const bookingRef = `HCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    navigate('/itinerary/tokyo-7day', {
      state: {
        guestName: form.leadName,
        bookingRef,
        travellersCount: 1,
        packageTitle: activePackage?.name,
        clinicName: selectedClinic?.name,
      },
    })
  }

  return (
    <div className="site-shell">
      <TopBar />

      <div className="page-header">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Book your health check' }]} />
        <h1>Book your health check holiday</h1>
        <div className="subtitle">10 steps — takes about 5 minutes. No payment until you confirm.</div>
      </div>

      {/* Step bar */}
      <div className="step-bar">
        {STEP_LABELS.map((label, i) => {
          const skipped = form.wantsLeisure === false && (i === 5 || i === 6)
          const isActive = i === step
          const isDone = i < step && !skipped
          return (
            <div
              key={label}
              className={`step-bar-item ${isActive ? 'active' : isDone ? 'done' : ''}`}
              style={skipped ? { opacity: 0.35, textDecoration: 'line-through' } : undefined}
            >
              {isDone ? `✓ ${label}` : `${i + 1} ${label}`}
            </div>
          )
        })}
      </div>

      <div className="two-col" style={{ gridTemplateColumns: '1fr 240px', alignItems: 'start' }}>
        <div className="main-col">

          {/* Step 0 — Country tiles */}
          {step === 0 && (
            <div>
              <div className="inset">
                <strong>Step 1 of 10 — Choose a destination.</strong> Japan is live on the platform today. Other destinations are coming soon.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {COUNTRIES.map(c => (
                  <button
                    key={c.id}
                    disabled={!c.active}
                    onClick={() => c.active && set('countryId', c.id)}
                    style={{
                      background: form.countryId === c.id ? 'var(--hch-green-50)' : '#f9f9f7',
                      border: form.countryId === c.id ? '2px solid var(--hch-green-800)' : 'var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 8px',
                      textAlign: 'center',
                      cursor: c.active ? 'pointer' : 'not-allowed',
                      opacity: c.active ? 1 : 0.4,
                      position: 'relative',
                    }}
                  >
                    {!c.active && (
                      <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 8, background: '#888', color: '#fff', padding: '1px 4px', borderRadius: 3 }}>
                        Soon
                      </span>
                    )}
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{c.flag}</div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{c.tagline}</div>
                  </button>
                ))}
              </div>
              <StepNav onNext={goNext} canNext={!!form.countryId} />
            </div>
          )}

          {/* Step 1 — Clinic list (live from Supabase) */}
          {step === 1 && (
            <div>
              <div className="inset">
                <strong>Step 2 of 10 — Choose a clinic.</strong> All Japan clinics are JCI-accredited or hold equivalent international certification.
              </div>

              {clinicsLoading && <LoadingBlock label="Loading clinics…" />}
              {!clinicsLoading && clinicsError && (
                <ErrorBlock message={clinicsError} onRetry={() => setClinicsRetry(n => n + 1)} />
              )}

              {!clinicsLoading && !clinicsError && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {clinics.map(clinic => (
                    <label
                      key={clinic.id}
                      className="radio-item"
                      style={{ alignItems: 'flex-start', border: form.clinicId === clinic.id ? '2px solid var(--hch-green-800)' : undefined }}
                    >
                      <input
                        type="radio"
                        name="clinic"
                        checked={form.clinicId === clinic.id}
                        onChange={() => selectClinic(clinic.id)}
                        style={{ marginTop: 4 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{clinic.flag} {clinic.name}</div>
                        <div style={{ fontSize: 11, color: '#888', margin: '2px 0 6px' }}>{clinic.city} · {clinic.accreditation}</div>
                        {clinic.specialties && <div style={{ fontSize: 12, color: '#555' }}>{clinic.specialties}</div>}
                        {clinic.price_min_usd > 0 && (
                          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                            From ${clinic.price_min_usd}{clinic.price_max_usd > 0 ? `–$${clinic.price_max_usd}` : ''}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                  {clinics.length === 0 && (
                    <div style={{ padding: '16px 0', color: '#888', fontSize: 13 }}>No clinics available right now.</div>
                  )}
                </div>
              )}

              <StepNav onBack={goBack} onNext={goNext} canNext={!!form.clinicId} />
            </div>
          )}

          {/* Step 2 — Package tiles (live from Supabase) */}
          {step === 2 && (
            <div>
              <div className="inset">
                <strong>Step 3 of 10 — Choose your screening level.</strong> All tiers are available at {selectedClinic?.name}.
              </div>

              {packagesLoading && <LoadingBlock label="Loading packages…" />}
              {!packagesLoading && packagesError && (
                <ErrorBlock message={packagesError} onRetry={() => setPackagesRetry(n => n + 1)} />
              )}

              {!packagesLoading && !packagesError && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {packageOptions.map(pkg => (
                    <div
                      key={pkg.id}
                      onClick={() => set('packageId', pkg.id)}
                      style={{
                        background: pkg.bg_color || 'var(--hch-green-50)',
                        border: form.packageId === pkg.id ? '2px solid var(--hch-green-800)' : 'var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '16px 18px',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      {(pkg.badge || pkg.tier === 'comprehensive') && (
                        <span style={{ position: 'absolute', top: 14, right: 14, background: tierAccent(pkg.tier), color: '#fff', fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4 }}>
                          {pkg.badge || 'Most popular'}
                        </span>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 500, color: tierAccent(pkg.tier) }}>{pkg.name}</div>
                          <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{pkg.duration} · {capitalize(pkg.tier)}</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 500, color: tierAccent(pkg.tier) }}>
                          ${pkg.price_usd}<span style={{ fontSize: 10, color: '#888', fontWeight: 400 }}>/person</span>
                        </div>
                      </div>
                      {pkg.description && <div style={{ fontSize: 12, color: '#444', lineHeight: 1.5 }}>{pkg.description}</div>}
                      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                        {pkg.is_jci && <span className="tag tag-green">JCI accredited</span>}
                        {pkg.is_english && <span className="tag tag-green">English support</span>}
                        {pkg.rating > 0 && <span className="tag">★ {pkg.rating} · {pkg.review_count} reviews</span>}
                      </div>
                    </div>
                  ))}
                  {packageOptions.length === 0 && (
                    <div style={{ padding: '16px 0', color: '#888', fontSize: 13 }}>No packages available for this clinic yet.</div>
                  )}
                </div>
              )}

              <StepNav onBack={goBack} onNext={goNext} canNext={!!form.packageId} />
            </div>
          )}

          {/* Step 3 — Package breakdown + prep instructions (live from Supabase) */}
          {step === 3 && (
            <div>
              <div className="inset">
                <strong>Step 4 of 10 — Your package in full.</strong> Here's exactly what's included and how to prepare.
              </div>

              {detailLoading && <LoadingBlock label="Loading package details…" />}
              {!detailLoading && detailError && (
                <ErrorBlock message={detailError} onRetry={() => setDetailRetry(n => n + 1)} />
              )}

              {!detailLoading && !detailError && activePackage && (
                <>
                  <div style={{ border: 'var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 16 }}>
                    <div style={{ background: activePackage.bg_color || 'var(--hch-green-50)', padding: '14px 16px' }}>
                      <div style={{ fontSize: 16, fontWeight: 500, color: tierAccent(activePackage.tier) }}>{activePackage.name}</div>
                      <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{selectedClinic?.name} · {activePackage.duration}</div>
                    </div>
                    <div style={{ padding: '4px 0' }}>
                      {groupByCategory(standardTests).map(([category, items]) => (
                        <div key={category}>
                          <div style={{ padding: '8px 16px 2px', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
                            {category}
                          </div>
                          {items.map(test => (
                            <div key={test.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 16px', fontSize: 13 }}>
                              <CheckDot /> {test.name}
                            </div>
                          ))}
                        </div>
                      ))}
                      {standardTests.length === 0 && (
                        <div style={{ padding: '10px 16px', color: '#888', fontSize: 12 }}>Test list unavailable right now.</div>
                      )}
                    </div>
                  </div>

                  <h4 style={{ marginBottom: 8 }}>How to prepare</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    {PREP_INSTRUCTIONS.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#444', lineHeight: 1.6 }}>
                        <span style={{ color: 'var(--hch-green-600)', fontWeight: 500, flexShrink: 0 }}>→</span>{tip}
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#f5f5f3', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#555' }}>
                    <span style={{ fontWeight: 500, color: '#111' }}>Total for this package: </span>
                    ${activePackage.price_usd} screening + ${COORD_FEE} coordination fee = ${activePackage.price_usd + COORD_FEE}
                  </div>
                </>
              )}

              <StepNav onBack={goBack} onNext={goNext} />
            </div>
          )}

          {/* Step 4 — Journey fork */}
          {step === 4 && (
            <div>
              <div className="inset">
                <strong>Step 5 of 10 — Plan your journey.</strong> Would you like us to build leisure activities around your health check day?
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button onClick={() => set('wantsLeisure', true)} style={forkCardStyle(form.wantsLeisure === true)}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🗺️</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Yes, plan my leisure time</div>
                  <div style={{ fontSize: 12, color: '#666' }}>We'll build a personalised itinerary around your interests.</div>
                </button>
                <button onClick={() => set('wantsLeisure', false)} style={forkCardStyle(form.wantsLeisure === false)}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🩺</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>No, just the health check</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Skip straight to booking — no itinerary needed.</div>
                </button>
              </div>
              <StepNav onBack={goBack} onNext={goNext} canNext={form.wantsLeisure !== null} />
            </div>
          )}

          {/* Step 5 — Interests grid */}
          {step === 5 && (
            <div>
              <div className="inset">
                <strong>Step 6 of 10 — What are you interested in?</strong> Select at least one — we'll use this to build your itinerary preview.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {INTEREST_CATEGORIES.map(cat => {
                  const isSel = form.interests.includes(cat.id)
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleInterest(cat.id)}
                      style={{
                        background: isSel ? 'var(--hch-green-50)' : '#fff',
                        border: isSel ? '2px solid var(--hch-green-800)' : 'var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 4 }}>{cat.emoji}</div>
                      <div style={{ fontSize: 12, fontWeight: isSel ? 500 : 400, color: isSel ? 'var(--hch-green-800)' : '#333' }}>{cat.label}</div>
                    </button>
                  )
                })}
              </div>
              <StepNav onBack={goBack} onNext={goNext} canNext={form.interests.length > 0} />
            </div>
          )}

          {/* Step 6 — 3x3 dynamic itinerary grid */}
          {step === 6 && (
            <div>
              <div className="inset">
                <strong>Step 7 of 10 — Your itinerary preview.</strong> Based on your interests — the full day-by-day plan is finalised after booking.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {itineraryPreview.map((cell, i) => {
                  const cat = INTEREST_CATEGORIES.find(c => c.id === cell.interestId)
                  return (
                    <div key={i} style={{ border: 'var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 10px', background: '#fff' }}>
                      <div style={{ fontSize: 18, marginBottom: 6 }}>{cat?.emoji}</div>
                      <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>{cell.activity}</div>
                      <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>{cat?.label}</div>
                    </div>
                  )
                })}
              </div>
              <StepNav onBack={goBack} onNext={goNext} />
            </div>
          )}

          {/* Step 7 — Lead capture + compliance toggles */}
          {step === 7 && (
            <div>
              <div className="inset">
                <strong>Step {form.wantsLeisure ? 8 : 6} of 10 — Your details.</strong> We'll use this to confirm your slot with {selectedClinic?.name}.
              </div>

              <div className="form-group">
                <label className="form-label">Full name</label>
                <input className="form-input" value={form.leadName} onChange={e => set('leadName', e.target.value)} placeholder="Sarah Reynolds" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.leadEmail} onChange={e => set('leadEmail', e.target.value)} placeholder="you@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" type="tel" value={form.leadPhone} onChange={e => set('leadPhone', e.target.value)} placeholder="+1 555 000 0000" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ marginBottom: 8 }}>Health compliance</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {COMPLIANCE_ITEMS.map(item => (
                    <label key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={form.compliance[item.id]}
                        onChange={() => toggleCompliance(item.id)}
                        style={{ accentColor: 'var(--hch-green-800)', width: 15, height: 15, marginTop: 2, flexShrink: 0 }}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              <StepNav onBack={goBack} onNext={goNext} canNext={canProceedLead} />
            </div>
          )}

          {/* Step 8 — Checkout summary + Stripe-style modal trigger */}
          {step === 8 && activePackage && (
            <div>
              <div className="inset">
                <strong>Step {form.wantsLeisure ? 9 : 7} of 10 — Payment.</strong> Secure checkout in USD. No charge until your slot is confirmed by the hospital.
              </div>

              <div style={{ border: 'var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ background: activePackage.bg_color || 'var(--hch-green-50)', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
                  {selectedClinic?.flag || '🗾'}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{activePackage.name} — {selectedClinic?.name}</div>
                  <div style={{ fontSize: 12, color: '#888', margin: '2px 0 10px' }}>{form.leadName} · {form.leadEmail}</div>
                  <div className="bb-breakdown" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
                    <div className="bb-line"><span>Screening</span><span>${activePackage.price_usd}</span></div>
                    <div className="bb-line"><span>Coordination fee</span><span>${COORD_FEE}</span></div>
                    <div className="bb-total"><span>Total (USD)</span><span>${total}</span></div>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14 }}
                onClick={() => setShowCheckout(true)}
              >
                Continue to secure payment — ${total}
              </button>

              <div style={{ marginTop: 10 }}>
                <button className="btn btn-ghost btn-sm" onClick={goBack}>← Back</button>
              </div>
            </div>
          )}

        </div>

        {/* Persistent sidebar */}
        <div className="side-col">
          <PersistentSidebar
            country={form.countryId ? 'Japan' : null}
            clinicName={selectedClinic?.name || null}
            packageName={activePackage?.name || null}
            price={activePackage ? total : null}
            priceNote={activePackage ? `$${activePackage.price_usd} screening + $${COORD_FEE} coordination` : null}
          />
        </div>
      </div>

      {/* Stripe-style checkout modal */}
      {showCheckout && activePackage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 380, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '18px 20px', borderBottom: 'var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Health Check Holidays</div>
              <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#888' }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Amount due</div>
              <div style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>
                ${total.toFixed(2)} <span style={{ fontSize: 13, color: '#888', fontWeight: 400 }}>USD</span>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={form.leadEmail} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Card information</label>
                <input
                  className="form-input"
                  placeholder="1234 1234 1234 1234"
                  value={card.number}
                  onChange={e => setCard(c => ({ ...c, number: e.target.value }))}
                  style={{ borderRadius: '8px 8px 0 0', marginBottom: -1 }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <input
                    className="form-input"
                    placeholder="MM / YY"
                    value={card.expiry}
                    onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))}
                    style={{ borderRadius: '0 0 0 8px' }}
                  />
                  <input
                    className="form-input"
                    placeholder="CVC"
                    value={card.cvc}
                    onChange={e => setCard(c => ({ ...c, cvc: e.target.value }))}
                    style={{ borderRadius: '0 0 8px 0', borderLeft: 'none' }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Name on card</label>
                <input className="form-input" placeholder="Full name" value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14, marginTop: 4, opacity: canPay ? 1 : 0.4, cursor: canPay ? 'pointer' : 'not-allowed' }}
                disabled={!canPay}
                onClick={handlePay}
              >
                Pay ${total.toFixed(2)}
              </button>
              <div style={{ fontSize: 10, color: '#aaa', textAlign: 'center', marginTop: 10 }}>
                Demo checkout — no real payment is processed.
              </div>
            </div>
          </div>
        </div>
      )}

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
      {onBack && <button className="btn btn-ghost" onClick={onBack}>← Back</button>}
    </div>
  )
}

function forkCardStyle(active) {
  return {
    background: active ? 'var(--hch-green-50)' : '#fff',
    border: active ? '2px solid var(--hch-green-800)' : 'var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 14px',
    textAlign: 'left',
    cursor: 'pointer',
  }
}

function CheckDot() {
  return (
    <div style={{ width: 16, height: 16, background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
        <path d="M1 3L3 5L7 1" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function LoadingBlock({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '32px 0', justifyContent: 'center', color: '#666', fontSize: 13 }}>
      <div className="spinner" />
      {label}
    </div>
  )
}

function ErrorBlock({ message, onRetry }) {
  return (
    <div className="inset" style={{ borderLeftColor: 'var(--hch-coral-400)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <strong>Something went wrong.</strong> {friendlyError(message)}
      </div>
      <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={onRetry}>
        Try again
      </button>
    </div>
  )
}

function friendlyError(message) {
  if (!message) return 'Please try again in a moment.'
  if (/fetch|network|failed to fetch/i.test(message)) {
    return "We couldn't reach our servers. Check your connection and try again."
  }
  return "We couldn't load this information right now. Please try again."
}

function groupByCategory(tests) {
  const map = new Map()
  for (const test of tests) {
    const key = test.category || 'Other'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(test)
  }
  return Array.from(map.entries())
}

function tierAccent(tier) {
  return tier === 'advanced' ? '#534AB7' : 'var(--hch-green-800)'
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
