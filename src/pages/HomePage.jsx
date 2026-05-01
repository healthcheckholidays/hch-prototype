import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { TopBar, Footer } from '../components/Nav'
import { packages } from '../data/packages'
import { PackageCard } from '../components/PackageCard'

const DESTINATIONS = [
  { emoji: '🗾', name: 'Japan', city: 'Tokyo & Osaka', saving: '$2,100+' },
  { emoji: '🇸🇬', name: 'Singapore', city: 'Singapore', saving: '$2,000+' },
  { emoji: '🇰🇷', name: 'South Korea', city: 'Seoul', saving: '$3,900+' },
  { emoji: '🇹🇭', name: 'Thailand', city: 'Bangkok', saving: '$2,200+' },
]

const TIERS = [
  {
    name: 'Essential',
    price: 'from $120',
    duration: '2 hours',
    color: 'var(--hch-green-50)',
    accent: 'var(--hch-green-800)',
    items: ['Full blood count', 'Cholesterol panel', 'Blood glucose', 'Blood pressure & BMI', 'Urinalysis'],
  },
  {
    name: 'Comprehensive',
    price: 'from $220',
    duration: 'Half day',
    color: '#E6F8F2',
    accent: 'var(--hch-green-800)',
    badge: 'Most popular',
    items: ['Everything in Essential', 'ECG (resting heart)', 'Chest X-ray', 'Liver & kidney function', 'Cancer markers (AFP, CEA, PSA)', 'Physician review'],
  },
  {
    name: 'Advanced',
    price: 'from $580',
    duration: 'Full day',
    color: 'var(--hch-purple-50)',
    accent: '#534AB7',
    items: ['Everything in Comprehensive', 'Full-body MRI or CT scan', 'Hormone & thyroid panel', 'Bone density scan', 'Executive 45-min consultation', 'Personalised health report'],
  },
]

const TRUST = [
  { num: '14,000+', label: 'screenings completed' },
  { num: '98%', label: 'results within 48 hours' },
  { num: '$1,840', label: 'average saving vs US' },
  { num: '4.8★', label: 'average rating' },
]

const WHY = [
  {
    icon: '💸',
    title: 'A fraction of US costs',
    body: 'A comprehensive blood panel plus ECG costs $2,000–$4,000 out-of-pocket in the US. The same screen at a JCI-accredited Asian hospital costs $150–$600 — all-in.',
  },
  {
    icon: '🏥',
    title: 'World-class hospitals',
    body: 'Every partner hospital is either JCI-accredited or holds equivalent international certification. Many rank among Asia\'s top facilities for medical tourism.',
  },
  {
    icon: '🗣',
    title: 'English from start to finish',
    body: 'Dedicated international health centres with English-speaking staff at every step — reception, consultation, and results — so nothing gets lost in translation.',
  },
  {
    icon: '📋',
    title: 'Plain-English results',
    body: 'Every result includes a plain-English summary emailed within 48 hours. If anything needs follow-up, a US-based teleconsult is included free of charge.',
  },
]

const HOW_STEPS = [
  { step: '1', title: 'Choose a package', body: 'Browse by destination, tier, or budget. Filter by JCI accreditation, duration, or screening type.' },
  { step: '2', title: 'Reserve your slot', body: 'Pick dates that fit your holiday. We contact the hospital and confirm within one business day.' },
  { step: '3', title: 'Receive a pre-arrival guide', body: 'What to eat, what to bring, how to get there — in plain English, sent to your inbox.' },
  { step: '4', title: 'Spend half a day at the hospital', body: 'Check in, complete your screening, and get back to your holiday. Most screenings take 2–5 hours.' },
  { step: '5', title: 'Get your results', body: 'Results emailed within 48 hours with a plain-English summary and recommended next steps.' },
]

const FEATURED_IDS = ['japan-comp', 'thai-comp', 'korea-adv', 'singapore-comp']

const SCENES = [
  {
    id: 'temple',
    bg: 'linear-gradient(160deg, #1a0a00 0%, #5c2d0a 40%, #8B4513 100%)',
    accent: '#F4A460',
    emoji: ['⛩️', '🌸', '👨‍👩‍👧‍👦'],
    emojiLayout: [
      { e: '⛩️', size: 110, top: '18%', left: '50%', transform: 'translateX(-50%)' },
      { e: '🌸', size: 48, top: '12%', left: '18%', transform: 'rotate(-15deg)' },
      { e: '🌸', size: 36, top: '16%', right: '20%', transform: 'rotate(10deg)' },
      { e: '👨‍👩‍👧‍👦', size: 56, bottom: '28%', left: '50%', transform: 'translateX(-50%)' },
    ],
    caption: 'Senso-ji Temple, Tokyo',
    headline: 'The holiday your family\nhas always dreamed of.',
    sub: 'Ancient temples, fresh ramen, cherry blossoms — and one morning that changes your health story.',
  },
  {
    id: 'health',
    bg: 'linear-gradient(160deg, #0b2e24 0%, #0d5c4a 50%, #1D9E75 100%)',
    accent: '#5DCAA5',
    emojiLayout: [
      { e: '🏥', size: 90, top: '14%', left: '50%', transform: 'translateX(-50%)' },
      { e: '🩺', size: 52, top: '16%', left: '22%' },
      { e: '✅', size: 44, top: '20%', right: '22%' },
      { e: '😌', size: 54, bottom: '26%', left: '50%', transform: 'translateX(-50%)' },
    ],
    caption: 'St. Luke\'s International Hospital, Tokyo',
    headline: 'Half a morning.\nA lifetime of peace of mind.',
    sub: 'JCI-accredited hospitals, English-speaking staff, full results in 48 hours — for a fraction of US costs.',
  },
  {
    id: 'market',
    bg: 'linear-gradient(160deg, #1a1200 0%, #5c4200 40%, #a07020 100%)',
    accent: '#FFD580',
    emojiLayout: [
      { e: '🏮', size: 70, top: '12%', left: '30%' },
      { e: '🏮', size: 55, top: '10%', right: '28%' },
      { e: '🍜', size: 80, top: '22%', left: '50%', transform: 'translateX(-50%)' },
      { e: '👩‍👧', size: 56, bottom: '26%', left: '50%', transform: 'translateX(-50%)' },
    ],
    caption: 'Yaowarat Road Night Market, Bangkok',
    headline: 'Explore by night.\nStay healthy for life.',
    sub: 'Street food, temples, hidden neighbourhoods — and a world-class health screen tucked into one morning.',
  },
  {
    id: 'results',
    bg: 'linear-gradient(160deg, #0a1628 0%, #103060 50%, #1a4a80 100%)',
    accent: '#7EB8F7',
    emojiLayout: [
      { e: '📋', size: 80, top: '16%', left: '50%', transform: 'translateX(-50%)' },
      { e: '✨', size: 44, top: '12%', left: '24%' },
      { e: '✨', size: 36, top: '18%', right: '22%' },
      { e: '🎉', size: 58, bottom: '26%', left: '50%', transform: 'translateX(-50%)' },
    ],
    caption: 'Results delivered within 48 hours',
    headline: 'All clear. Back to\nthe adventure.',
    sub: 'Plain-English results emailed to you. If anything needs follow-up, a US doctor calls you — included free.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const featured = packages.filter(p => FEATURED_IDS.includes(p.id))
  const [dest, setDest] = useState('')
  const [travellers, setTravellers] = useState('1')

  return (
    <div className="site-shell">
      <TopBar />

      {/* Cinematic video hero */}
      <div style={{ position: 'relative', height: 480, overflow: 'hidden', background: '#0b2e24' }}>

        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        >
          <source src={`/videos/${encodeURIComponent('FV動画（仮）.mp4')}`} type="video/mp4" />
        </video>

        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.78) 100%)',
        }} />

        {/* Text + search — pinned to bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '0 24px 22px',
        }}>
          {/* Eyebrow */}
          <div style={{
            fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#5DCAA5',
            marginBottom: 8,
          }}>
            Health screening + holiday, combined
          </div>

          {/* Headline */}
          <h1 style={{
            color: '#fff', fontSize: 26, fontWeight: 500,
            lineHeight: 1.25, marginBottom: 10,
            textShadow: '0 2px 16px rgba(0,0,0,0.5)',
          }}>
            The holiday your family<br />has always dreamed of —<br />with a health check built in.
          </h1>

          {/* Sub */}
          <p style={{
            color: 'rgba(255,255,255,0.82)', fontSize: 13,
            lineHeight: 1.6, marginBottom: 16, maxWidth: 440,
          }}>
            JCI-accredited hospitals across Asia. Half a morning. Results in 48 hours.
            Save thousands vs US costs.
          </p>

          {/* Search bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr auto',
            background: '#fff', borderRadius: 10,
            overflow: 'hidden', maxWidth: 480,
            boxShadow: '0 4px 28px rgba(0,0,0,0.35)',
          }}>
            <SearchBarField label="Where">
              <select
                value={dest}
                onChange={e => setDest(e.target.value)}
                style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, outline: 'none', cursor: 'pointer', color: dest ? '#111' : '#888' }}
              >
                <option value="">Any destination</option>
                {['Japan','Singapore','South Korea','Thailand','Taiwan','Malaysia','Hong Kong'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </SearchBarField>
            <SearchBarField label="Travellers" noBorder>
              <select
                value={travellers}
                onChange={e => setTravellers(e.target.value)}
                style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, outline: 'none', cursor: 'pointer', color: '#111' }}
              >
                <option value="1">1 person</option>
                <option value="2">2 people</option>
                <option value="3">3–4 people</option>
              </select>
            </SearchBarField>
            <button
              className="btn btn-primary"
              style={{ borderRadius: 0, padding: '0 20px', fontSize: 13, alignSelf: 'stretch' }}
              onClick={() => {
                const params = new URLSearchParams()
                if (dest) params.set('dest', dest)
                params.set('travellers', travellers)
                navigate(`/search?${params.toString()}`)
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'var(--hch-green-800)', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        {TRUST.map((t, i) => (
          <div key={t.label} style={{
            padding: '14px 16px', textAlign: 'center',
            borderRight: i < 3 ? '0.5px solid rgba(255,255,255,0.15)' : 'none',
          }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>{t.num}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{t.label}</div>
          </div>
        ))}
      </div>

      {/* Why it matters */}
      <div style={{ padding: '32px 24px', borderBottom: 'var(--border)' }}>
        <div className="section-label">Why health check holidays</div>
        <h2 style={{ marginBottom: 20 }}>Everything US healthcare isn't</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {WHY.map(w => (
            <div key={w.title} style={{ display: 'flex', gap: 12 }}>
              <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{w.icon}</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{w.title}</div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{w.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works — summary */}
      <div style={{ padding: '32px 24px', borderBottom: 'var(--border)', background: '#f9f9f7' }}>
        <div className="section-label">How it works</div>
        <h2 style={{ marginBottom: 20 }}>Five steps, one holiday</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {HOW_STEPS.map((s, i) => (
            <div key={s.step} style={{ display: 'flex', gap: 14, paddingBottom: i < HOW_STEPS.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--hch-green-800)', color: '#fff',
                  fontSize: 12, fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {s.step}
                </div>
                {i < HOW_STEPS.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: 'rgba(13,92,74,0.2)', marginTop: 4 }} />
                )}
              </div>
              <div style={{ paddingBottom: i < HOW_STEPS.length - 1 ? 12 : 0 }}>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => navigate('/how-it-works')}>
          See the full process →
        </button>
      </div>

      {/* Featured destinations */}
      <div style={{ padding: '32px 24px', borderBottom: 'var(--border)' }}>
        <div className="section-label">Popular destinations</div>
        <h2 style={{ marginBottom: 6 }}>Where do you want to go?</h2>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
          Eight destinations across Asia, all with English-speaking hospitals and proven track records.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
          {DESTINATIONS.map(d => (
            <button
              key={d.name}
              onClick={() => navigate(`/destinations`)}
              style={{
                background: '#f5f5f3', border: 'var(--border)', borderRadius: 'var(--radius-lg)',
                padding: '14px 10px', textAlign: 'center', cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hch-green-800)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{d.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{d.city}</div>
              <div style={{ fontSize: 11, color: 'var(--hch-green-600)', marginTop: 4 }}>Save {d.saving}</div>
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/destinations')}>
          Explore all 8 destinations →
        </button>
      </div>

      {/* Featured packages */}
      <div style={{ padding: '32px 24px', borderBottom: 'var(--border)' }}>
        <div className="section-label">Featured packages</div>
        <h2 style={{ marginBottom: 20 }}>Most booked this year</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {featured.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
        </div>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/shop')}>
          Browse all packages
        </button>
      </div>

      {/* Pricing tiers */}
      <div style={{ padding: '32px 24px', borderBottom: 'var(--border)', background: '#f9f9f7' }}>
        <div className="section-label">Pricing</div>
        <h2 style={{ marginBottom: 6 }}>Three tiers, one goal</h2>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
          Choose the depth of screening that fits your health goals and travel plans.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TIERS.map(tier => (
            <div
              key={tier.name}
              style={{ background: tier.color, border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', position: 'relative' }}
            >
              {tier.badge && (
                <span style={{
                  position: 'absolute', top: 14, right: 14,
                  background: tier.accent, color: '#fff',
                  fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4,
                }}>
                  {tier.badge}
                </span>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: tier.accent }}>{tier.name}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{tier.duration}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 500, color: tier.accent }}>{tier.price}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tier.items.map(item => (
                  <span key={item} style={{
                    fontSize: 11, background: 'rgba(255,255,255,0.7)',
                    border: 'var(--border)', borderRadius: 4, padding: '2px 7px', color: '#444',
                  }}>
                    {item}
                  </span>
                ))}
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => navigate(`/shop`)}
              >
                See {tier.name.toLowerCase()} packages →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trust signals */}
      <div style={{ padding: '32px 24px' }}>
        <div className="section-label">Why trust us</div>
        <h2 style={{ marginBottom: 20 }}>Built for peace of mind</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <TrustRow icon="🔒" text="All partner hospitals are JCI-accredited or hold equivalent international certification." />
          <TrustRow icon="📧" text="Results and a plain-English summary emailed within 48 hours of your screening." />
          <TrustRow icon="📞" text="Free US-based teleconsult included if any result requires follow-up." />
          <TrustRow icon="❌" text="Free cancellation up to 30 days before your appointment. No charge until confirmed." />
          <TrustRow icon="🛂" text="No visa required for US passport holders in Japan, Thailand, Singapore, Taiwan, and Malaysia." />
        </div>
      </div>

      <Footer />
    </div>
  )
}

function SearchBarField({ label, children, noBorder }) {
  return (
    <div style={{ padding: '8px 12px', borderRight: noBorder ? 'none' : '0.5px solid #e8e8e8' }}>
      <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 3 }}>{label}</div>
      {children}
    </div>
  )
}

function TrustRow({ icon, text }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', border: 'var(--border)', borderRadius: 'var(--radius-md)', background: '#fff' }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}
