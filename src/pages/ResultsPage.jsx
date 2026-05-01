import { useParams, useNavigate } from 'react-router-dom'
import { TopBar, Footer, Breadcrumb } from '../components/Nav'
import { mockUser } from '../data/user'

const RESULTS = [
  {
    section: 'Blood',
    tests: [
      { name: 'Total cholesterol', result: '5.1 mmol/L', range: '<5.2', status: 'normal', note: 'Within healthy range' },
      { name: 'LDL cholesterol', result: '3.8 mmol/L', range: '<3.0', status: 'amber', note: 'Slightly above ideal — worth monitoring' },
      { name: 'Blood glucose (fasting)', result: '5.4 mmol/L', range: '<5.6', status: 'normal', note: 'Normal fasting glucose' },
      { name: 'Haemoglobin', result: '14.2 g/dL', range: '13–17', status: 'normal', note: 'Healthy red blood cell count' },
    ],
  },
  {
    section: 'Heart',
    tests: [
      { name: 'Blood pressure', result: '138/88 mmHg', range: '<130/80', status: 'amber', note: 'Slightly elevated — monitor regularly' },
      { name: 'ECG', result: 'Normal sinus rhythm', range: '—', status: 'normal', note: 'No irregularities found' },
    ],
  },
  {
    section: 'Liver & kidney',
    tests: [
      { name: 'ALT (liver enzymes)', result: '28 U/L', range: '<40', status: 'normal', note: 'Liver enzymes normal' },
      { name: 'Creatinine (kidney)', result: '84 µmol/L', range: '60–110', status: 'normal', note: 'Kidney function within range' },
    ],
  },
  {
    section: 'Cancer markers',
    tests: [
      { name: 'PSA (prostate)', result: '1.2 ng/mL', range: '<4.0', status: 'normal', note: 'No elevation detected' },
      { name: 'CEA (colorectal marker)', result: '1.8 µg/L', range: '<5.0', status: 'normal', note: 'No abnormal markers' },
      { name: 'AFP (liver marker)', result: '3.1 µg/L', range: '<10.0', status: 'normal', note: 'Within reference range' },
    ],
  },
  {
    section: 'Other',
    tests: [
      { name: 'Thyroid (TSH)', result: '2.1 mIU/L', range: '0.4–4.0', status: 'normal', note: 'Thyroid function normal' },
      { name: 'Urinalysis', result: 'No abnormalities', range: '—', status: 'normal', note: 'No protein, blood or glucose detected' },
    ],
  },
]

const STATUS_CONFIG = {
  normal: { dot: '#1D9E75', label: 'Normal', tagCls: 'tag-green' },
  amber:  { dot: '#BA7517', label: 'Borderline', tagCls: 'tag-amber' },
  flagged: { dot: '#D85A30', label: 'Flagged', tagCls: '' },
}

export default function ResultsPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const trip = [...mockUser.pastTrips, ...mockUser.trips].find(t => t.id === tripId) || mockUser.pastTrips[0]

  const amberTests = RESULTS.flatMap(s => s.tests).filter(t => t.status === 'amber')
  const flaggedTests = RESULTS.flatMap(s => s.tests).filter(t => t.status === 'flagged')

  return (
    <div className="site-shell">
      <TopBar />

      <div className="page-header">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'My account', href: '/account' },
          { label: 'Results' },
        ]} />
        <h1>Health screening results</h1>
        <div className="subtitle">Bumrungrad International Hospital · Bangkok · March 2025</div>
      </div>

      {/* Trip summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: 'var(--border)', background: '#f9f9f7' }}>
        <SummaryCell label="Destination" value="Bangkok, Thailand" />
        <SummaryCell label="Date" value="March 2025" />
        <SummaryCell label="Hospital" value="Bumrungrad International" />
        <SummaryCell label="Package" value="Comprehensive" />
      </div>

      <div className="two-col">
        <div className="main-col">

          <div className="inset" style={{ borderLeftColor: '#1D9E75' }}>
            <strong>Understanding your results:</strong> Green means your result is within the healthy reference range.
            Amber means borderline — not alarming, but worth discussing with your doctor at your next visit.
            Red would indicate a result that needs prompt attention.
          </div>

          {RESULTS.map(section => (
            <div key={section.section} style={{ marginBottom: 24 }}>
              <div className="section-label" style={{ marginBottom: 8 }}>{section.section}</div>
              <div style={{ border: 'var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {/* Header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto 2fr', gap: 0, background: '#f9f9f7', borderBottom: 'var(--border)', padding: '6px 12px' }}>
                  {['Test', 'Your result', 'Reference', '', 'What it means'].map((h, i) => (
                    <div key={i} style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>{h}</div>
                  ))}
                </div>
                {section.tests.map((test, i) => {
                  const cfg = STATUS_CONFIG[test.status]
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr auto 2fr',
                        alignItems: 'center',
                        gap: 0,
                        padding: '9px 12px',
                        borderBottom: i < section.tests.length - 1 ? 'var(--border)' : 'none',
                        fontSize: 13,
                      }}
                    >
                      <div style={{ fontWeight: 400 }}>{test.name}</div>
                      <div style={{ color: '#111' }}>{test.result}</div>
                      <div style={{ color: '#888', fontSize: 12 }}>{test.range}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingRight: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                      </div>
                      <div style={{ fontSize: 12, color: '#555' }}>{test.note}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

        </div>

        {/* Sidebar */}
        <div className="side-col">

          {/* Next steps card */}
          <div className="booking-box" style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Next steps</div>

            {flaggedTests.length === 0 && amberTests.length === 0 && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D9E75', marginTop: 4, flexShrink: 0 }} />
                <span style={{ color: '#333' }}>All results within normal range — no immediate action needed.</span>
              </div>
            )}

            {amberTests.map(t => (
              <div key={t.name} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#BA7517', marginTop: 4, flexShrink: 0 }} />
                <span style={{ color: '#333' }}><strong>{t.name}:</strong> discuss with your doctor at your next check-up.</span>
              </div>
            ))}

            {flaggedTests.map(t => (
              <div key={t.name} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D85A30', marginTop: 4, flexShrink: 0 }} />
                <span style={{ color: '#333' }}><strong>{t.name}:</strong> seek medical advice promptly.</span>
              </div>
            ))}

            <div style={{ borderTop: 'var(--border)', paddingTop: 10, marginTop: 6 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
                A plain-English summary has been emailed to {mockUser.email}
              </div>
              <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginBottom: 6 }}>
                Download full report
              </button>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/shop')}>
                Book follow-up screening
              </button>
            </div>
          </div>

          {/* Legend */}
          <div style={{ background: '#f9f9f7', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 12 }}>
            <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 13 }}>Result key</div>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                <span style={{ color: '#444' }}>{cfg.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

function SummaryCell({ label, value }) {
  return (
    <div style={{ padding: '10px 14px', borderRight: 'var(--border)' }}>
      <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
    </div>
  )
}
