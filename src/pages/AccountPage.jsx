import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, Footer } from '../components/Nav'
import { mockUser } from '../data/user'
import { packages } from '../data/packages'

const TABS = [
  { id: 'trips', label: 'My trips' },
  { id: 'saved', label: 'Saved' },
  { id: 'health', label: 'Health profile' },
  { id: 'docs', label: 'Documents' },
]

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('trips')
  const navigate = useNavigate()
  const user = mockUser

  return (
    <div className="site-shell">
      <TopBar />

      {/* Account header */}
      <div style={{ background: 'var(--hch-green-800)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px 16px' }}>
          <div style={{ width: 48, height: 48, background: '#1D9E75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500, color: '#fff', flexShrink: 0 }}>
            {user.initials}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              Member since {user.memberSince} · {user.email}
            </div>
          </div>
        </div>
        <div className="acct-tabs" style={{ padding: '0 24px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`acct-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: My trips */}
      {activeTab === 'trips' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '0.5px solid rgba(0,0,0,0.1)' }}>
            <StatCell num={user.stats.tripsBooked} label="Trips booked" />
            <StatCell num={user.stats.tripsCompleted} label="Completed" />
            <StatCell num={`$${user.stats.savedVsUs.toLocaleString()}`} label="Saved vs US costs" />
          </div>

          <div style={{ padding: '16px 24px 4px', fontSize: 14, fontWeight: 500 }}>Upcoming trips</div>
          <div style={{ padding: '0 24px' }}>
            {user.trips.map(trip => (
              <TripCard key={trip.id} trip={trip} onViewItinerary={() => navigate(`/itinerary/${trip.itineraryId}`)} />
            ))}
          </div>

          <div style={{ padding: '16px 24px 4px', fontSize: 14, fontWeight: 500 }}>Past trips</div>
          <div style={{ padding: '0 24px 24px' }}>
            {user.pastTrips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                isPast
                onViewResults={() => navigate(`/results/${trip.id}`)}
                onBookAgain={() => navigate('/shop')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Saved */}
      {activeTab === 'saved' && (
        <div style={{ padding: 24 }}>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 14 }}>
            {user.saved.length} packages saved to your wishlist
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {user.saved.map(id => {
              const pkg = packages.find(p => p.id === id)
              if (!pkg) return null
              return (
                <div key={id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/shop/${pkg.id}`)}>
                  <div style={{ height: 64, background: pkg.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, position: 'relative' }}>
                    {pkg.emoji}
                    <span style={{ position: 'absolute', top: 6, right: 8, color: 'var(--hch-gold-dark)', fontSize: 14 }}>♥</span>
                  </div>
                  <div className="card-body">
                    <div style={{ fontSize: 10, color: '#888' }}>{pkg.destination}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, margin: '2px 0 4px' }}>{pkg.destination} {capitalize(pkg.tier)} Check</div>
                    <div style={{ fontSize: 12, color: 'var(--hch-gold-dark)', fontWeight: 600 }}>from ${pkg.price}/person</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab: Health profile */}
      {activeTab === 'health' && (
        <div style={{ padding: 24 }}>
          <div className="inset">
            Your health profile helps us match you to the right packages. This is private and never shared.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <ProfileField label="Age range" value={user.healthProfile.ageRange} />
            <ProfileField label="Last check-up" value={user.healthProfile.lastCheckup} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Screening interests</div>
            <div>
              {user.healthProfile.interests.map(i => (
                <span key={i} style={{ display: 'inline-block', background: '#E1F5EE', color: '#085041', fontSize: 11, padding: '3px 8px', borderRadius: 4, margin: 2 }}>{i}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <ProfileField label="Known conditions" value={user.healthProfile.conditions} />
            <ProfileField label="Allergies" value={user.healthProfile.allergies} />
          </div>
          <ProfileField label="Preferred package level" value={user.healthProfile.preferredTier} />
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/profile')}>Update health profile</button>
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === 'docs' && (
        <div style={{ padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Health results & reports</div>
          {user.documents.filter(d => d.type === 'results').map(doc => (
            <DocRow key={doc.id} doc={doc} />
          ))}
          <div style={{ fontSize: 14, fontWeight: 500, margin: '20px 0 12px' }}>Trip documents</div>
          {user.documents.filter(d => d.type !== 'results').map(doc => (
            <DocRow key={doc.id} doc={doc} onView={doc.type === 'itinerary' ? () => navigate('/itinerary/tokyo-7day') : null} />
          ))}
        </div>
      )}

      <Footer />
    </div>
  )
}

function StatCell({ num, label }) {
  return (
    <div style={{ padding: '14px 16px', borderRight: '0.5px solid rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--hch-gold-dark)' }}>{num}</div>
      <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function TripCard({ trip, isPast, onViewItinerary, onViewResults, onBookAgain }) {
  const statusMap = {
    confirmed: { label: 'Confirmed', cls: 'status-confirmed' },
    pending: { label: 'Enquiry sent', cls: 'status-pending' },
    completed: { label: 'Completed', cls: 'status-completed' },
  }
  const status = statusMap[trip.status]

  return (
    <div className="trip-card">
      <div className="trip-card-head">
        <div className="trip-thumb" style={{ background: trip.bgColor }}>
          <span style={{ fontSize: 32 }}>{trip.emoji}</span>
        </div>
        <div className="trip-info">
          <div className="trip-dest">{trip.destination}</div>
          <div className="trip-title">{trip.title}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`tag ${status.cls}`} style={{ fontSize: 10, padding: '2px 7px' }}>{status.label}</span>
            <span style={{ fontSize: 11, color: '#888' }}>{trip.dates} · {trip.travellers} {trip.travellers === 1 ? 'person' : 'people'}</span>
          </div>
        </div>
      </div>
      <div className="trip-actions">
        {!isPast && trip.itineraryId && (
          <button className="btn btn-primary btn-sm" onClick={onViewItinerary}>View itinerary</button>
        )}
        {!isPast && trip.itineraryId && (
          <button className="btn btn-ghost btn-sm" onClick={onViewItinerary}>Print itinerary</button>
        )}
        {!isPast && trip.status === 'pending' && (
          <button className="btn btn-primary btn-sm">Complete booking</button>
        )}
        {isPast && <button className="btn btn-primary btn-sm" onClick={onViewResults}>View results</button>}
        {isPast && <button className="btn btn-ghost btn-sm">Download report</button>}
        {isPast && <button className="btn btn-ghost btn-sm" onClick={onBookAgain}>Book again</button>}
        {!isPast && <button className="btn btn-ghost btn-sm">Hospital details</button>}
      </div>
    </div>
  )
}

function ProfileField({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, padding: '8px 10px', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 8, background: 'var(--hch-sand)' }}>{value}</div>
    </div>
  )
}

function DocRow({ doc, onView }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
      <div>
        <div style={{ fontSize: 13 }}>{doc.name}</div>
        <div style={{ fontSize: 11, color: '#888' }}>{doc.meta}</div>
      </div>
      <button
        className="btn btn-ghost btn-sm"
        onClick={onView || undefined}
        style={{ flexShrink: 0 }}
      >
        {onView ? 'View & print' : 'Download'}
      </button>
    </div>
  )
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
