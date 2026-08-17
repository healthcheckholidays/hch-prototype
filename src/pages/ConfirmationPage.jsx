import { useParams, useNavigate } from 'react-router-dom'
import { TopBar, Footer } from '../components/Nav'
import { mockUser } from '../data/user'

const NEXT_STEPS = [
  'We contact the hospital and confirm your slot (1 business day)',
  'You receive a pre-arrival guide by email',
  'Arrive, check in, and spend half a day at the hospital',
  'Results and plain-English summary emailed within 48 hours',
]

export default function ConfirmationPage() {
  const { bookingRef } = useParams()
  const navigate = useNavigate()

  const ref = bookingRef || 'HCH-2025-0614'
  const trip = mockUser.trips.find(t => t.bookingRef === ref) || mockUser.trips[0]

  return (
    <div className="site-shell">
      <TopBar />

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px 48px' }}>

        {/* Check icon */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 64,
            height: 64,
            background: 'var(--hch-green-50)',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            border: '2px solid var(--hch-green-300)',
          }}>
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <path d="M2 11L10 19L26 3" stroke="#145247" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 6 }}>Screening slot reserved</h1>
          <p style={{ fontSize: 14, color: '#666' }}>
            Your booking is confirmed and the hospital has been notified.
          </p>
        </div>

        {/* Booking reference */}
        <div style={{
          background: 'var(--hch-sand)',
          border: 'var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          textAlign: 'center',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
            Booking reference
          </div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 20, fontWeight: 500, color: 'var(--hch-green-800)', letterSpacing: '0.05em' }}>
            {ref}
          </div>
        </div>

        {/* What happens next */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 14 }}>What happens next</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {NEXT_STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--hch-green-800)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trip summary card */}
        {trip && (
          <div style={{ border: 'var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ background: trip.bgColor, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              {trip.emoji}
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{trip.destination}</div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{trip.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <TripDetail label="Dates" value={trip.dates} />
                <TripDetail label="Travellers" value={`${trip.travellers} ${trip.travellers === 1 ? 'person' : 'people'}`} />
                <TripDetail label="Package" value="Comprehensive" />
                <TripDetail label="Total paid" value="$348" />
              </div>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => navigate('/account')}
          >
            View my account
          </button>
          <button
            className="btn btn-ghost"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => navigate('/shop')}
          >
            Browse more packages
          </button>
        </div>

        {/* Footer note */}
        <div style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
          A confirmation email has been sent to{' '}
          <a href={`mailto:${mockUser.email}`}>{mockUser.email}</a>
        </div>

      </div>

      <Footer />
    </div>
  )
}

function TripDetail({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13 }}>{value}</div>
    </div>
  )
}
