import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { TopBar, Footer } from '../components/Nav'
import { Timeline } from '../components/Timeline'
import { getItinerary } from '../data/itineraries'

const LEGEND = [
  { type: 'health', label: 'Health check', color: '#0d5c4a' },
  { type: 'explore', label: 'Sightseeing', color: '#378ADD' },
  { type: 'food', label: 'Food & dining', color: '#BA7517' },
  { type: 'travel', label: 'Travel', color: '#888780' },
]

export default function ItineraryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const itin = getItinerary(id)

  if (!itin) return <div style={{ padding: 40, textAlign: 'center' }}>Itinerary not found.</div>

  const bookingRef = location.state?.bookingRef || 'HCH-2025-0614'
  const travellers = location.state?.guestName || 'Sarah Reynolds & James Reynolds'
  const travellersCount = location.state?.travellersCount || 2

  return (
    <div className="site-shell">
      <div className="no-print">
        <TopBar />
      </div>

      {/* Itinerary header — prints in green */}
      <div className="itin-header" style={{ background: '#0d5c4a', padding: '20px 24px' }}>
        <div style={{ color: '#5DCAA5', fontSize: 13, fontWeight: 500, marginBottom: 12 }}>
          Health Check Holidays
        </div>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 500, lineHeight: 1.25, marginBottom: 4 }}>
          {itin.title}
        </h1>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          {travellers} · Booking ref: {bookingRef}
        </div>
        {location.state?.packageTitle && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
            {location.state.packageTitle} · {location.state.clinicName}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', marginTop: 16, paddingTop: 12, borderTop: '0.5px solid rgba(255,255,255,0.2)' }}>
          <MetaItem label="Dates" value="14–21 Jun 2025" />
          <MetaItem label="Travellers" value={`${travellersCount} ${travellersCount === 1 ? 'adult' : 'adults'}`} />
          <MetaItem label="Hospital" value={itin.hospital.split(' ').slice(0, 2).join(' ')} />
          <MetaItem label="Screening" value={`Day ${itin.appointmentDay} · ${itin.appointmentTime}`} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '0 24px 32px' }}>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '14px 0', borderBottom: '0.5px solid rgba(0,0,0,0.08)', marginBottom: 4 }}>
          {LEGEND.map(l => (
            <div key={l.type} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#666' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
              {l.label}
            </div>
          ))}
        </div>

        {itin.days.map(day => (
          <div key={day.day} style={{ marginTop: 22 }}>

            {/* Day label row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                background: day.isHealthDay ? '#085041' : '#0d5c4a',
                color: '#fff',
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 12px',
                borderRadius: 12,
                whiteSpace: 'nowrap',
              }}>
                {day.day === itin.appointmentDay ? 'Health check day' : `Day ${day.day}`}
              </span>
              <span style={{ fontSize: 12, color: '#888' }}>{day.date}</span>
              <div style={{ flex: 1, height: 0.5, background: 'rgba(0,0,0,0.1)' }} />
            </div>

            {/* Pre-day tip */}
            {day.preDayTip && (
              <div className="inset" style={{ marginBottom: 12 }}>
                <strong>{day.preDayTip.label}:</strong> {day.preDayTip.text}
              </div>
            )}

            {/* Hospital info card on health day */}
            {day.isHealthDay && (
              <div className="hosp-info-card">
                <h4 style={{ marginBottom: 8 }}>{itin.hospital} — International Health Centre</h4>
                <div className="hosp-info-row"><span>Address</span><span>{itin.hospitalAddress}</span></div>
                <div className="hosp-info-row"><span>Your appointment</span><span>{itin.appointmentTime} — arrive fasted</span></div>
                <div className="hosp-info-row"><span>Expected duration</span><span>4–5 hours</span></div>
                <div className="hosp-info-row"><span>What to bring</span><span>Passport · booking confirmation email</span></div>
                <div className="hosp-info-row"><span>Getting there</span><span>Taxi from Shinjuku ~20 min · ¥1,800</span></div>
              </div>
            )}

            <Timeline events={day.events} />
          </div>
        ))}

        {/* Emergency contacts */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Emergency contacts</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ContactCard title="HCH coordinator" phone={itin.coordinatorPhone} email="coord@healthcheckholidays.com" />
            <ContactCard title={itin.hospital} phone={itin.hospitalPhone} email="International Health Centre" />
          </div>
        </div>
      </div>

      {/* Print / back bar */}
      <div className="print-bar-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '0.5px solid rgba(0,0,0,0.1)', background: '#f9f9f7' }}>
        <div style={{ fontSize: 11, color: '#888' }}>
          Ref: {bookingRef} · healthcheckholidays.com
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/account')}>← Back to account</button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>Print / Save as PDF</button>
        </div>
      </div>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  )
}

function MetaItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginTop: 2 }}>{value}</div>
    </div>
  )
}

function ContactCard({ title, phone, email }) {
  return (
    <div style={{ background: '#f5f5f3', borderRadius: 8, padding: '10px 12px', fontSize: 12 }}>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{title}</div>
      <div style={{ color: '#555' }}>{phone}</div>
      <div style={{ color: '#555' }}>{email}</div>
    </div>
  )
}
