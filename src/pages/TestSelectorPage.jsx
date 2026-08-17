import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, Footer, Breadcrumb } from '../components/Nav'
import { ADDON_TESTS, TEST_CATEGORIES, matchHospitals, getAddon } from '../data/tests'

const STANDARD_INCLUDED = [
  'Full blood count (CBC)', 'Fasting blood glucose', 'Cholesterol panel (HDL/LDL/triglycerides)',
  'Liver function (AST, ALT, GGT)', 'Kidney function (creatinine, eGFR)', 'TSH (thyroid)',
  'Chest X-ray', 'Abdominal ultrasound', '12-lead resting ECG',
  'Blood pressure & BMI', 'Urinalysis', 'Doctor consultation & written report',
]

export default function TestSelectorPage() {
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState('heart')
  const [selected, setSelected] = useState(new Set())

  const selectedIds = [...selected]

  const hospitalMatches = useMemo(
    () => matchHospitals(selectedIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds.join(',')]
  )

  const fullMatches    = hospitalMatches.filter(h => h.status === 'full')
  const partialMatches = hospitalMatches.filter(h => h.status === 'partial')
  const noMatches      = hospitalMatches.filter(h => h.status === 'none')

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleContinue() {
    const fullIds = fullMatches.map(h => h.id).join(',')
    sessionStorage.setItem('hch_selected_tests', selectedIds.join(','))
    sessionStorage.setItem('hch_matching_hosps', fullIds)
    navigate(fullIds ? `/shop?hosps=${fullIds}` : '/shop')
  }

  const categoryTests = ADDON_TESTS.filter(t => t.category === activeCat)

  return (
    <div className="site-shell">
      <TopBar />

      <div className="page-header">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Start planning', href: '/shop' },
          { label: 'Choose add-on tests' },
        ]} />
        <h1>Build your screening</h1>
        <div className="subtitle">
          Every package includes a standard panel. Select extras below — the hospital match panel updates live.
        </div>
      </div>

      {/* Standard tests block */}
      <div style={{ padding: '12px 24px 14px', background: 'var(--hch-sky)', borderBottom: 'var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', background: 'var(--hch-green-800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Included in every package — all 13 hospitals</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingLeft: 30 }}>
          {STANDARD_INCLUDED.map(name => (
            <span key={name} className="tag tag-green" style={{ fontSize: 10 }}>{name}</span>
          ))}
        </div>
      </div>

      <div className="two-col" style={{ gridTemplateColumns: '1fr 232px', alignItems: 'start' }}>
        {/* ── Left: test catalogue ── */}
        <div className="main-col">

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {TEST_CATEGORIES.map(cat => {
              const catCount = ADDON_TESTS.filter(t => t.category === cat.id && selected.has(t.id)).length
              return (
                <button
                  key={cat.id}
                  className={`chip ${activeCat === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCat(cat.id)}
                >
                  {cat.label}
                  {catCount > 0 && (
                    <span style={{
                      marginLeft: 4, background: activeCat === cat.id ? 'rgba(255,255,255,0.3)' : 'var(--hch-gold)',
                      color: activeCat === cat.id ? '#fff' : 'var(--hch-green-800)', borderRadius: 10, padding: '0 5px', fontSize: 10, fontWeight: 600,
                    }}>{catCount}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Test cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {categoryTests.map(test => {
              const isSel = selected.has(test.id)
              return (
                <div
                  key={test.id}
                  onClick={() => toggle(test.id)}
                  style={{
                    border: isSel ? '1.5px solid var(--hch-gold)' : 'var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '11px 13px',
                    cursor: 'pointer',
                    background: isSel ? 'rgba(250,168,5,0.15)' : 'var(--hch-sand)',
                    transition: 'border-color 0.12s, background 0.12s',
                    display: 'flex',
                    gap: 11,
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 17, height: 17, borderRadius: 4, flexShrink: 0, marginTop: 2,
                    border: isSel ? 'none' : '1.5px solid rgba(0,0,0,0.22)',
                    background: isSel ? 'var(--hch-gold)' : 'var(--hch-sand)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isSel && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.2 5.7L8 1" stroke="#145247" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{test.name}</span>
                      {test.popular  && <span className="tag tag-green" style={{ fontSize: 9 }}>Popular</span>}
                      {test.advanced && <span className="tag tag-blue"  style={{ fontSize: 9 }}>Advanced</span>}
                      {test.gender === 'female' && <span className="tag" style={{ fontSize: 9 }}>Women</span>}
                      {test.gender === 'male'   && <span className="tag" style={{ fontSize: 9 }}>Men</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#555', lineHeight: 1.55, marginBottom: 4 }}>{test.desc}</div>
                    <div style={{ fontSize: 11, color: 'var(--hch-green-600)', fontStyle: 'italic', marginBottom: 6 }}>→ {test.why}</div>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#888' }}>⏱ {test.duration}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--hch-gold-dark)' }}>+${test.price}</span>
                      <span style={{ fontSize: 11, color: '#aaa' }}>{test.hosps.length}/13 hospitals</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {categoryTests.length === 0 && (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>
                No add-ons in this category yet.
              </div>
            )}
          </div>

          {/* Selected pill strip */}
          {selected.size > 0 && (
            <div style={{
              marginTop: 16, padding: '10px 12px',
              background: 'rgba(250,168,5,0.15)', borderRadius: 'var(--radius-md)',
              border: '0.5px solid var(--hch-gold)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--hch-green-800)', marginBottom: 6 }}>
                {selected.size} add-on{selected.size !== 1 ? 's' : ''} selected
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {[...selected].map(id => {
                  const t = getAddon(id)
                  return t ? (
                    <span key={id} style={{
                      background: 'var(--hch-sand)', border: '0.5px solid var(--hch-gold)',
                      borderRadius: 20, padding: '2px 8px', fontSize: 11, color: 'var(--hch-green-800)',
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      {t.name}
                      <button
                        onClick={e => { e.stopPropagation(); toggle(id) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: 13, padding: 0, lineHeight: 1 }}
                      >×</button>
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: live hospital match panel ── */}
        <div className="side-col" style={{ position: 'sticky', top: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>Hospital match</div>
          <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5, marginBottom: 12 }}>
            {selectedIds.length === 0
              ? 'All 13 hospitals available — no extras selected yet.'
              : `${fullMatches.length} hospital${fullMatches.length !== 1 ? 's' : ''} offer${fullMatches.length === 1 ? 's' : ''} all ${selectedIds.length} selected test${selectedIds.length !== 1 ? 's' : ''}.`}
          </div>

          {/* Full matches */}
          {fullMatches.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              {selectedIds.length > 0 && (
                <div className="section-label" style={{ marginBottom: 5 }}>Full match</div>
              )}
              {fullMatches.map(h => <MatchRow key={h.id} h={h} />)}
            </div>
          )}

          {/* Partial matches */}
          {selectedIds.length > 0 && partialMatches.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div className="section-label" style={{ marginBottom: 5 }}>Partial match</div>
              {partialMatches.map(h => <MatchRow key={h.id} h={h} />)}
            </div>
          )}

          {/* Unavailable */}
          {selectedIds.length > 0 && noMatches.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div className="section-label" style={{ marginBottom: 5 }}>Unavailable</div>
              {noMatches.map(h => <MatchRow key={h.id} h={h} />)}
            </div>
          )}

          {/* No full match warning */}
          {selectedIds.length > 0 && fullMatches.length === 0 && (
            <div className="inset" style={{ borderLeftColor: 'var(--hch-amber-400)', fontSize: 11, marginBottom: 10 }}>
              No hospital offers all selected tests. Try removing one to broaden results.
            </div>
          )}

          {/* CTA */}
          <div style={{ paddingTop: 12, borderTop: 'var(--border)' }}>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%', justifyContent: 'center', marginBottom: 6 }}
              disabled={selectedIds.length > 0 && fullMatches.length === 0}
              onClick={handleContinue}
            >
              {selectedIds.length === 0
                ? 'Browse all packages'
                : `See packages — ${fullMatches.length} hospital${fullMatches.length !== 1 ? 's' : ''}`}
            </button>
            {selectedIds.length > 0 && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setSelected(new Set())}
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function MatchRow({ h }) {
  const colors = {
    full:    { dot: '#1D9E75', label: '#085041', missing: null },
    partial: { dot: '#BA7517', label: '#633806', missing: '#BA7517' },
    none:    { dot: '#ccc',    label: '#aaa',    missing: null },
  }
  const c = colors[h.status]

  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'flex-start',
      padding: '6px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
      opacity: h.status === 'none' ? 0.5 : 1,
    }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot, flexShrink: 0, marginTop: 4 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#111', lineHeight: 1.3 }}>
          {h.emoji} {h.name}
        </div>
        <div style={{ fontSize: 10, color: '#888' }}>{h.city}</div>
        {h.status === 'partial' && h.missing.length > 0 && (
          <div style={{ fontSize: 10, color: c.missing, marginTop: 2, lineHeight: 1.4 }}>
            Missing: {h.missing.join(', ')}
          </div>
        )}
      </div>
      <div style={{ fontSize: 10, fontWeight: 500, color: c.label, flexShrink: 0 }}>
        {h.status === 'full' && h.total > 0 && '✓ all'}
        {h.status === 'partial' && `${h.matched}/${h.total}`}
        {h.status === 'none' && '—'}
      </div>
    </div>
  )
}
