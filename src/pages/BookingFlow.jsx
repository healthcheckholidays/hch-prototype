import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { TopBar, Footer, Breadcrumb } from '../components/Nav'
import { PersistentSidebar } from '../components/PersistentSidebar'
import { COORD_FEE } from '../data/packages'
import { supabase } from '../lib/supabase'
import {
  COUNTRIES,
  PREP_INSTRUCTIONS,
  INTEREST_CATEGORIES,
  SCREENING_TILE,
  TOKYO_ACTIVITIES,
  TRAVEL_WINDOWS,
  MEDICAL_QUESTIONS,
  LEAD_CAPTURE_LEGAL_COPY,
  stripeLegalCopy,
  buildDynamicItinerary,
} from '../data/bookingFlowData'

const STEP_LABELS = ['Country', 'Clinic', 'Package', 'Prepare', 'Journey', 'Interests', 'Itinerary', 'Your info', 'Payment']
const DIAGNOSTIC_ICONS = [
  { icon: '🧲', label: 'MRI' },
  { icon: '🩻', label: 'X-Ray' },
  { icon: '🔬', label: 'Colonoscopy' },
]

export default function BookingFlow() {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)
  const [card] = useState({ number: '4242 4242 4242 4242', expiry: '12/34', cvc: '123', name: 'Demo User' })
  const [tileActivities, setTileActivities] = useState(Array(8).fill(null))

  const [form, setForm] = useState({
    countryId: '',
    clinicId: '',
    packageId: '',
    wantsLeisure: null,
    interests: [],
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    travelWindow: '',
    medical: { cardiovascular: null, implants: null, bloodThinners: null },
  })

  // ── Supabase-backed data ────────────────────────────────────────────────
  const [clinics, setClinics] = useState([])
  const [clinicsLoading, setClinicsLoading] = useState(false)
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

  // Arriving with a destination already chosen elsewhere (home search,
  // Destinations page) — pre-select that country and skip straight to
  // Step 2's clinic list instead of making the user pick it again.
  useEffect(() => {
    const countryName = location.state?.countryName
    if (!countryName) return
    const country = COUNTRIES.find(c => c.name === countryName)
    if (!country) return
    setForm(f => ({ ...f, countryId: country.id }))
    setStep(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch clinics for the selected country whenever it changes (retryable).
  const selectedCountry = COUNTRIES.find(c => c.id === form.countryId)

  useEffect(() => {
    if (!selectedCountry) {
      setClinics([])
      return
    }
    let cancelled = false
    setClinicsLoading(true)
    setClinicsError(null)
    supabase
      .from('hospitals')
      .select('*')
      .eq('country_code', selectedCountry.countryCode)
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
  }, [selectedCountry?.countryCode, clinicsRetry])

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

  function setMedicalAnswer(id, value) {
    setForm(f => ({ ...f, medical: { ...f.medical, [id]: value } }))
  }

  function toggleInterest(id) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id) ? f.interests.filter(i => i !== id) : [...f.interests, id],
    }))
  }

  function reportTileActivity(cellIndex, activity) {
    setTileActivities(prev => {
      if (prev[cellIndex] === activity) return prev
      const next = [...prev]
      next[cellIndex] = activity
      return next
    })
  }

  const selectedClinic = clinics.find(c => c.id === form.clinicId)

  const selectedPackageOption = packageOptions.find(p => p.id === form.packageId) || null
  const activePackage = packageDetail || selectedPackageOption
  const total = activePackage ? activePackage.price_usd + COORD_FEE : 0

  // Country tile click — every destination is bookable; auto-advances
  // (accordion collapses Step 1, expands Step 2).
  function selectCountry(country) {
    setForm(f => ({ ...f, countryId: country.id, clinicId: '', packageId: '' }))
    setStep(1)
  }

  // Clinic tile click — every fetched clinic is bookable; auto-advances.
  function selectClinicAndAdvance(clinic) {
    setForm(f => ({ ...f, clinicId: clinic.id, packageId: '' }))
    setStep(2)
  }

  // Package tile click — every fetched package is bookable; auto-advances.
  function selectPackageAndAdvance(pkg) {
    set('packageId', pkg.id)
    setStep(3)
  }

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
    form.travelWindow &&
    MEDICAL_QUESTIONS.every(q => form.medical[q.id] !== null)

  const canPay = true

  function handlePay() {
    const bookingRef = `HCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const dynamicDays = buildDynamicItinerary(form.wantsLeisure ? tileActivities.filter(Boolean) : [], selectedClinic?.name)
    navigate('/itinerary/tokyo-7day', {
      state: {
        guestName: form.leadName,
        bookingRef,
        travellersCount: 1,
        packageTitle: activePackage?.name,
        clinicName: selectedClinic?.name,
        dynamicDays,
        dynamicAppointmentDay: 2,
        dynamicAppointmentTime: SCREENING_TILE.time,
      },
    })
  }

  function collapsedSummary(i) {
    switch (i) {
      case 0: return `Destination: ${selectedCountry?.name || '—'}`
      case 1: return `Clinic: ${selectedClinic?.name || '—'}`
      case 2: return `Package: ${activePackage?.name || '—'}`
      case 3: return 'Package details reviewed'
      case 4: return `Journey: ${form.wantsLeisure ? 'Leisure itinerary planned' : 'Health check only'}`
      case 5: return `Interests: ${form.interests.length} selected`
      case 6: return 'Itinerary previewed'
      case 7: return `Details: ${form.leadName || '—'}`
      default: return STEP_LABELS[i]
    }
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

      <div className="two-col booking-two-col" style={{ gridTemplateColumns: '1fr 240px', alignItems: 'start' }}>
        <div className="main-col booking-main-col">

          {/* Collapsed history of completed steps */}
          {STEP_LABELS.map((_, i) => {
            if (i >= step) return null
            if (form.wantsLeisure === false && (i === 5 || i === 6)) return null
            return (
              <div key={i} className="step-collapsed" onClick={() => setStep(i)}>
                <span>✓ {collapsedSummary(i)}</span>
                <span className="edit-hint">Edit</span>
              </div>
            )
          })}

          {/* Active step content */}
          <div className="step-expand" key={step}>

            {/* Step 0 — Country tiles (every destination is bookable) */}
            {step === 0 && (
              <div>
                <div className="inset">
                  <strong>Step 1 of 10 — Choose a destination.</strong> Every destination below is live and ready to book.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {COUNTRIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => selectCountry(c)}
                      className="tile-active-hover"
                      style={{
                        background: form.countryId === c.id ? 'rgba(250,168,5,0.15)' : 'var(--hch-sand)',
                        border: form.countryId === c.id ? '2px solid var(--hch-gold)' : 'var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 4 }}>{c.flag}</div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{c.tagline}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 — Clinic list (live from Supabase; every clinic is bookable) */}
            {step === 1 && (
              <div>
                <div className="inset">
                  <strong>Step 2 of 10 — Choose a clinic.</strong> All {selectedCountry?.name} clinics are JCI-accredited or hold equivalent international certification.
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
                        className="radio-item tile-active-hover"
                        onClick={() => selectClinicAndAdvance(clinic)}
                        style={{ alignItems: 'flex-start', border: form.clinicId === clinic.id ? '2px solid var(--hch-gold)' : undefined }}
                      >
                        <input
                          type="radio"
                          name="clinic"
                          checked={form.clinicId === clinic.id}
                          readOnly
                          style={{ marginTop: 4 }}
                        />
                        <div style={{ flex: 1, display: 'flex', gap: 12 }}>
                          <div style={{
                            width: 72, height: 72, borderRadius: 'var(--radius-md)', flexShrink: 0, overflow: 'hidden',
                            background: 'var(--hch-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                          }}>
                            {clinic.image_url ? (
                              <img
                                src={clinic.image_url}
                                alt={clinic.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
                              />
                            ) : null}
                            <span style={{ display: clinic.image_url ? 'none' : 'flex' }}>{clinic.flag}</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 500, fontSize: 14 }}>{clinic.flag} {clinic.name}</div>
                            <div style={{ fontSize: 11, color: '#888', margin: '2px 0 6px' }}>{clinic.city} · {clinic.accreditation}</div>
                            {clinic.specialties && <div style={{ fontSize: 12, color: '#555' }}>{clinic.specialties}</div>}
                            {clinic.price_min_usd > 0 && (
                              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                                From ${clinic.price_min_usd}{clinic.price_max_usd > 0 ? `–$${clinic.price_max_usd}` : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                    {clinics.length === 0 && (
                      <div style={{ padding: '16px 0', color: '#888', fontSize: 13 }}>No clinics available right now.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2 — Package tiles (live from Supabase; side by side; every tier bookable) */}
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
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, Math.min(packageOptions.length, 3))}, 1fr)`, gap: 10 }}>
                    {packageOptions.map(pkg => (
                      <div
                        key={pkg.id}
                        onClick={() => selectPackageAndAdvance(pkg)}
                        className="tile-active-hover"
                        style={{
                          border: form.packageId === pkg.id ? '2px solid var(--hch-gold)' : 'var(--border)',
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative',
                          background: 'var(--hch-sand)',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {(pkg.badge || pkg.tier === 'comprehensive') && (
                          <span style={{ position: 'absolute', top: 8, right: 8, zIndex: 1, background: 'var(--hch-gold)', color: 'var(--hch-green-800)', fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 4 }}>
                            {pkg.badge || 'Most popular'}
                          </span>
                        )}
                        {/* Lifestyle image header (or colour fallback) */}
                        <div style={{
                          height: 72, background: pkg.image_url ? undefined : packageFallbackColor(pkg.tier),
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, overflow: 'hidden',
                        }}>
                          {pkg.image_url ? (
                            <img src={pkg.image_url} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (selectedClinic?.flag || '🗾')}
                        </div>
                        <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: 14, fontWeight: 500, color: tierAccent(pkg.tier) }}>{pkg.name}</div>
                          <div style={{ fontSize: 11, color: '#666', margin: '2px 0 6px' }}>{pkg.duration} · {capitalize(pkg.tier)}</div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--hch-gold-dark)', marginBottom: 6 }}>
                            ${pkg.price_usd}<span style={{ fontSize: 10, color: '#888', fontWeight: 400 }}>/person</span>
                          </div>
                          {pkg.description && <div style={{ fontSize: 11, color: '#444', lineHeight: 1.5, marginBottom: 8 }}>{pkg.description}</div>}
                          <IconRow />
                        </div>
                      </div>
                    ))}
                    {packageOptions.length === 0 && (
                      <div style={{ padding: '16px 0', color: '#888', fontSize: 13 }}>No packages available for this clinic yet.</div>
                    )}
                  </div>
                )}
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
                        <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{selectedClinic?.name} · Estimated {activePackage.duration} in clinic</div>
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

                    <div style={{ background: 'var(--hch-sand)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#555' }}>
                      <span style={{ fontWeight: 500, color: '#111' }}>Total for this package: </span>
                      ${activePackage.price_usd} screening + ${COORD_FEE} coordination fee = <span style={{ fontWeight: 600, color: 'var(--hch-gold-dark)' }}>${activePackage.price_usd + COORD_FEE}</span>
                    </div>
                  </>
                )}

                <StepNav onBack={goBack} onNext={goNext} label="Confirm Package & Proceed" />
              </div>
            )}

            {/* Step 4 — Journey fork (high-contrast) */}
            {step === 4 && (
              <div>
                <div className="inset">
                  <strong>Step 5 of 10 — Plan your journey.</strong> Would you like us to build leisure activities around your health check day?
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button onClick={() => set('wantsLeisure', true)} style={forkCardStyle(form.wantsLeisure === true, true)}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🗺️</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>Continue to customize my leisure itinerary</div>
                  </button>
                  <button onClick={() => set('wantsLeisure', false)} style={forkCardStyle(form.wantsLeisure === false, false)}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🩺</div>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>
                      I would like to plan my own leisure activities. Just provide me with discounted packages from our partners for my screening.
                    </div>
                  </button>
                </div>
                <StepNav onBack={goBack} onNext={goNext} canNext={form.wantsLeisure !== null} />
              </div>
            )}

            {/* Step 5 — Interests grid (6 fixed categories) */}
            {step === 5 && (
              <div>
                <div className="inset">
                  <strong>Step 6 of 10 — What are you interested in?</strong> Select at least one — every combination draws from our curated Tokyo experience pool.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {INTEREST_CATEGORIES.map(cat => {
                    const isSel = form.interests.includes(cat.id)
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleInterest(cat.id)}
                        style={{
                          background: isSel ? 'rgba(250,168,5,0.15)' : 'var(--hch-sand)',
                          border: isSel ? '2px solid var(--hch-gold)' : 'var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px 8px',
                          textAlign: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontSize: 24, marginBottom: 4 }}>{cat.emoji}</div>
                        <div style={{ fontSize: 12, fontWeight: isSel ? 600 : 400, color: isSel ? 'var(--hch-green-800)' : '#333' }}>{cat.label}</div>
                      </button>
                    )
                  })}
                </div>
                <StepNav onBack={goBack} onNext={goNext} canNext={form.interests.length > 0} label="Generate My Itinerary" />
              </div>
            )}

            {/* Step 6 — 3x3 itinerary grid: locked centre screening tile + 8 flip tiles */}
            {step === 6 && (
              <div>
                <div className="inset">
                  <strong>Step 7 of 10 — Your itinerary preview.</strong> Your screening slot is locked in the centre. Tap any other tile to see alternative experiences.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[0, 1, 2, 3, 'center', 4, 5, 6, 7].map((cell, gridPos) => (
                    cell === 'center' ? (
                      <div key="center" style={{
                        height: 96, border: '2px solid var(--hch-green-800)', borderRadius: 'var(--radius-md)',
                        background: 'var(--hch-green-800)', color: '#fff', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', padding: 8, position: 'relative', textAlign: 'center',
                      }}>
                        <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 8, fontWeight: 500, background: 'rgba(255,255,255,0.25)', padding: '2px 6px', borderRadius: 3 }}>
                          🔒 Confirmed
                        </span>
                        <div style={{ fontSize: 18, marginBottom: 4 }}>🩺</div>
                        <div style={{ fontSize: 11, fontWeight: 500 }}>{SCREENING_TILE.title}</div>
                        <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>{SCREENING_TILE.time}</div>
                      </div>
                    ) : (
                      <FlipTile
                        key={cell}
                        pool={TOKYO_ACTIVITIES}
                        initialIndex={cell}
                        onActivityChange={activity => reportTileActivity(cell, activity)}
                      />
                    )
                  ))}
                </div>
                <StepNav onBack={goBack} onNext={goNext} />
              </div>
            )}

            {/* Step 7 — Lead capture + medical intake */}
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
                  <label className="form-label">Preferred travel window</label>
                  <select className="form-select" value={form.travelWindow} onChange={e => set('travelWindow', e.target.value)}>
                    <option value="">Select a month</option>
                    {TRAVEL_WINDOWS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: 8 }}>Medical intake</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {MEDICAL_QUESTIONS.map(q => (
                      <div key={q.id}>
                        <div style={{ fontSize: 13, marginBottom: 6 }}>{q.label}</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {['Yes', 'No'].map(opt => {
                            const active = form.medical[q.id] === opt
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setMedicalAnswer(q.id, opt)}
                                style={{
                                  padding: '6px 20px', borderRadius: 'var(--radius-md)', fontSize: 12, cursor: 'pointer',
                                  border: active ? '2px solid var(--hch-gold)' : 'var(--border)',
                                  background: active ? 'rgba(250,168,5,0.15)' : 'var(--hch-sand)',
                                  color: active ? 'var(--hch-green-800)' : '#444',
                                  fontWeight: active ? 600 : 400,
                                }}
                              >
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="inset">{LEAD_CAPTURE_LEGAL_COPY}</div>

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
        </div>

        {/* Persistent sidebar */}
        <div className="side-col booking-side-col">
          <PersistentSidebar
            country={selectedCountry?.name || null}
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
          <div style={{ background: 'var(--hch-sand)', borderRadius: 12, width: '100%', maxWidth: 380, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '18px 20px', borderBottom: 'var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 500, fontFamily: "'Playfair Display', serif", color: 'var(--hch-green-800)' }}>Health Check Holidays</div>
              <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#888' }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Amount due</div>
              <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 10, color: 'var(--hch-gold-dark)' }}>
                ${total.toFixed(2)} <span style={{ fontSize: 13, color: '#888', fontWeight: 400 }}>USD</span>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                <span className="tag">🧪 Demo checkout — simulated only</span>
              </div>

              <div style={{ fontSize: 11, color: '#888', marginBottom: 14, lineHeight: 1.5 }}>
                This is not a real payment form. It's pre-filled with a test card and isn't
                connected to Stripe or any payment processor — no card data is collected, sent
                anywhere, or stored.
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={form.leadEmail} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Card information (demo — not editable)</label>
                <input
                  className="form-input"
                  value={card.number}
                  readOnly
                  style={{ borderRadius: '8px 8px 0 0', marginBottom: -1, background: '#f4f4f4' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <input
                    className="form-input"
                    value={card.expiry}
                    readOnly
                    style={{ borderRadius: '0 0 0 8px', background: '#f4f4f4' }}
                  />
                  <input
                    className="form-input"
                    value={card.cvc}
                    readOnly
                    style={{ borderRadius: '0 0 8px 0', borderLeft: 'none', background: '#f4f4f4' }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Name on card</label>
                <input className="form-input" value={card.name} readOnly style={{ background: '#f4f4f4' }} />
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14, marginTop: 4, opacity: canPay ? 1 : 0.4, cursor: canPay ? 'pointer' : 'not-allowed' }}
                disabled={!canPay}
                onClick={handlePay}
              >
                Pay ${total.toFixed(2)}
              </button>

              <div style={{ fontSize: 10, color: '#888', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
                {stripeLegalCopy(selectedClinic?.name)}
              </div>
              <div style={{ fontSize: 9, color: '#bbb', textAlign: 'center', marginTop: 6 }}>
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

function StepNav({ onBack, onNext, canNext = true, label = 'Save and continue' }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
      <button
        className="btn btn-primary"
        onClick={onNext}
        disabled={!canNext}
        style={{ opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'not-allowed' }}
      >
        {label}
      </button>
      {onBack && <button className="btn btn-ghost" onClick={onBack}>← Back</button>}
    </div>
  )
}

function forkCardStyle(active, isPrimary) {
  if (isPrimary) {
    return {
      background: active ? 'var(--hch-green-700)' : 'var(--hch-green-800)',
      border: active ? '2px solid var(--hch-gold)' : '2px solid var(--hch-green-800)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 16px',
      textAlign: 'left',
      cursor: 'pointer',
      color: '#fff',
    }
  }
  return {
    background: active ? '#111' : '#fff',
    border: active ? '2px solid #111' : '2px solid #ccc',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 16px',
    textAlign: 'left',
    cursor: 'pointer',
    color: active ? '#fff' : '#111',
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

function IconRow() {
  return (
    <div style={{ display: 'flex', gap: 14, marginTop: 'auto', paddingTop: 8, borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
      {DIAGNOSTIC_ICONS.map(d => (
        <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 9, color: '#666' }}>
          <span style={{ fontSize: 16 }}>{d.icon}</span>
          {d.label}
        </div>
      ))}
    </div>
  )
}

function FlipTile({ pool, initialIndex, onActivityChange }) {
  const [index, setIndex] = useState(initialIndex % pool.length)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    onActivityChange(pool[index])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  function handleClick() {
    if (flipping) return
    setFlipping(true)
    setTimeout(() => {
      setIndex(i => (i + 1) % pool.length)
      setFlipping(false)
    }, 400)
  }

  const current = pool[index]
  const next = pool[(index + 1) % pool.length]

  return (
    <div className="flip-outer" style={{ height: 96 }} onClick={handleClick}>
      <div className={`flip-inner ${flipping ? 'flipped' : ''}`}>
        <div className="flip-face" style={{ border: 'var(--border)', borderRadius: 'var(--radius-md)', padding: '10px', background: 'var(--hch-sand)', cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>{current.emoji}</div>
          <div style={{ fontSize: 11, fontWeight: 500, lineHeight: 1.3 }}>{current.title}</div>
        </div>
        <div className="flip-face flip-face-back" style={{ border: 'var(--border)', borderRadius: 'var(--radius-md)', padding: '10px', background: 'var(--hch-sand)', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>{next.emoji}</div>
          <div style={{ fontSize: 11, fontWeight: 500, lineHeight: 1.3 }}>{next.title}</div>
        </div>
      </div>
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

function packageFallbackColor(tier) {
  return tier === 'advanced' ? 'var(--hch-amber-50)' : 'var(--hch-green-50)'
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
