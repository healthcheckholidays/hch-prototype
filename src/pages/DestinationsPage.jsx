import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, Footer, Breadcrumb } from '../components/Nav'
import { packages } from '../data/packages'

const DESTINATIONS = [
  {
    id: 'japan',
    name: 'Japan',
    city: 'Tokyo & Osaka',
    emoji: '🗾',
    bgColor: '#E1F5EE',
    tagline: 'Cutting-edge medicine meets ancient culture',
    why: 'Japan consistently ranks among the world\'s top healthcare systems. Hospitals are immaculate, staff are meticulous, and the country\'s technology infrastructure means results are fast and accurate.',
    visaNote: 'No visa required for US passport holders (up to 90 days)',
    bestTime: 'March–May (cherry blossom) · Sept–Nov (autumn foliage)',
    flight: '~12–14 hours from US West Coast',
    currency: 'Japanese Yen (JPY) · ~¥150 per USD',
    tips: [
      'Book hospital appointment at least 4 weeks ahead — slots fill quickly.',
      'Arrive fasted the morning of your check-up (water only after 9pm the night before).',
      'Bring your passport — hospitals require ID for all international patients.',
      'Download Google Translate with Japanese offline pack for menus and signs.',
      'IC card (Suica or Pasmo) loaded with ¥3,000 covers all metro rides.',
    ],
    packages: ['japan-comp', 'japan-ess'],
    usComparison: { test: 'Comprehensive blood panel + ECG + X-ray', us: '$2,400', here: 'from $160' },
  },
  {
    id: 'singapore',
    name: 'Singapore',
    city: 'Singapore',
    emoji: '🇸🇬',
    bgColor: '#E6F1FB',
    tagline: 'English-first, world-ranked hospitals',
    why: 'Singapore\'s healthcare system is ranked among the best in Asia. English is an official language, all hospital signage and staff communicate in English, and the city-state has zero language barrier for US visitors.',
    visaNote: 'No visa required for US passport holders (up to 30 days)',
    bestTime: 'Feb–Apr (cooler and drier) · avoid monsoon Nov–Jan',
    flight: '~18 hours from US West Coast',
    currency: 'Singapore Dollar (SGD) · ~S$1.35 per USD',
    tips: [
      'Singapore hospitals are the most English-friendly in Asia — no translator needed.',
      'MRT is excellent — EZ-Link card covers all transit from ~S$1.50 per ride.',
      'Hawker centres offer extraordinary food from S$3–8 — visit Lau Pa Sat or Maxwell.',
      'Book a harbour cruise or Gardens by the Bay to fill non-hospital days.',
      'Tap water is safe to drink — no need to buy bottled water.',
    ],
    packages: ['singapore-comp'],
    usComparison: { test: 'Comprehensive screen + thyroid + cancer markers', us: '$2,400', here: 'from $349' },
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    city: 'Seoul',
    emoji: '🇰🇷',
    bgColor: '#FAEEDA',
    tagline: 'Advanced imaging at a fraction of US costs',
    why: 'South Korea leads Asia in advanced diagnostics. MRI and CT scans available within a day\'s notice at world-class JCI hospitals — procedures that cost $3,000–$5,000 in the US are a fraction of that here.',
    visaNote: 'No visa required for US passport holders (up to 90 days)',
    bestTime: 'April–June · Sept–Nov (mild, clear skies)',
    flight: '~11–13 hours from US West Coast',
    currency: 'Korean Won (KRW) · ~₩1,330 per USD',
    tips: [
      'Seoul metro is world-class — T-money card works on all buses and subway.',
      'Severance and Asan Medical Center both have dedicated international health centres.',
      'Korea\'s advanced tier includes MRI — schedule for day 2 or 3 of your trip.',
      'Try jjimjilbang (Korean spa) the evening before — relaxing and great for sleep.',
      'Namdaemun and Myeongdong markets for food and shopping on non-hospital days.',
    ],
    packages: ['korea-adv'],
    usComparison: { test: 'Full-body MRI + comprehensive blood work', us: '$4,500', here: 'from $599' },
  },
  {
    id: 'thailand',
    name: 'Thailand',
    city: 'Bangkok',
    emoji: '🇹🇭',
    bgColor: '#FBEAF0',
    tagline: 'World-famous hospitals, unbeatable value',
    why: 'Bumrungrad International in Bangkok is one of the most visited hospitals in the world for medical tourism. The staff are experienced with international patients, and the cost savings versus the US are enormous.',
    visaNote: 'No visa required for US passport holders (up to 30 days)',
    bestTime: 'Nov–Feb (cool and dry season)',
    flight: '~17–20 hours from US (often via connection)',
    currency: 'Thai Baht (THB) · ~฿35 per USD',
    tips: [
      'Bumrungrad\'s International Health Centre is on the 8th floor — go straight there.',
      'Grab app is the reliable taxi alternative — skip street taxis for airport.',
      'Eat street food freely — Bangkok\'s food scene is extraordinary and very safe.',
      'Temple dress code: cover shoulders and knees for Wat Pho, Grand Palace.',
      'Combine Bangkok with a beach (Koh Samui or Hua Hin — 45 min by flight).',
    ],
    packages: ['thai-comp'],
    usComparison: { test: 'Comprehensive screen + cancer markers + physician consult', us: '$2,400', here: 'from $220' },
  },
  {
    id: 'taiwan',
    name: 'Taiwan',
    city: 'Taipei',
    emoji: '🇹🇼',
    bgColor: '#EEEDFE',
    tagline: 'Excellent value, underrated destination',
    why: 'Taiwan\'s National Health Insurance system means hospitals maintain exceptionally high standards. Taipei is a compact, easy city to navigate and one of Asia\'s best food destinations.',
    visaNote: 'No visa required for US passport holders (up to 90 days)',
    bestTime: 'Oct–Dec (mild and clear)',
    flight: '~14–16 hours from US West Coast',
    currency: 'New Taiwan Dollar (TWD) · ~NT$31 per USD',
    tips: [
      'EasyCard works on MRT, buses, and 7-Eleven — load NT$500 on arrival.',
      'Night markets (Shilin, Raohe) are safe, fun and food is incredible from NT$50.',
      'Hospital staff speak English well at international health centres.',
      'Day trip to Jiufen or Taroko Gorge — some of Asia\'s most beautiful scenery.',
      'Bring a light rain jacket — Taipei gets sudden showers year-round.',
    ],
    packages: ['taiwan-comp'],
    usComparison: { test: 'Comprehensive screen + cancer markers', us: '$2,400', here: 'from $245' },
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    city: 'Kuala Lumpur',
    emoji: '🇲🇾',
    bgColor: '#E1F5EE',
    tagline: 'Budget-friendly, English-speaking, diverse',
    why: 'Malaysia is one of the most affordable medical tourism destinations in Asia. English is widely spoken throughout the healthcare system, and Kuala Lumpur is a vibrant, easy city to visit.',
    visaNote: 'No visa required for US passport holders (up to 90 days)',
    bestTime: 'May–Sept (drier on west coast)',
    flight: '~20+ hours from US (via connection)',
    currency: 'Malaysian Ringgit (MYR) · ~RM4.7 per USD',
    tips: [
      'Grab is the go-to transport app — safe and reliable throughout KL.',
      'Batu Caves, Petronas Towers, and Central Market are all within 30 min of hospitals.',
      'Food is extraordinary — Nasi Lemak, Char Kway Teow, Roti Canai from RM5.',
      'Pantai Hospital Bangsar has excellent English signage and patient services.',
      'Extend to Penang or Langkawi for beaches — cheap domestic flights (Air Asia).',
    ],
    packages: ['msia-ess'],
    usComparison: { test: 'Essential blood panel + blood pressure', us: '$1,200', here: 'from $120' },
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    city: 'Ho Chi Minh City',
    emoji: '🇻🇳',
    bgColor: '#FEF3E2',
    tagline: 'Emerging destination, outstanding value',
    why: 'Vietnam\'s private hospital sector has grown rapidly, with FV Hospital in HCMC holding JCI accreditation. The country offers extraordinary value and is one of Southeast Asia\'s most exciting destinations.',
    visaNote: 'E-visa required — apply online before travel (~$25, 90 days)',
    bestTime: 'Dec–Apr (south) · May–Sept (north)',
    flight: '~20+ hours from US (via connection)',
    currency: 'Vietnamese Dong (VND) · ~₫24,000 per USD',
    tips: [
      'FV Hospital (Ho Chi Minh City) is JCI-accredited and excellent for international patients.',
      'Grab works well throughout HCMC and Hanoi.',
      'Street food is safe and spectacular — Pho from ₫30,000, Banh Mi from ₫20,000.',
      'Book your e-visa at least 3 business days before travel.',
      'Day trips: Mekong Delta, Cu Chi Tunnels, or fly to Hoi An (45 min).',
    ],
    packages: [],
    usComparison: { test: 'Comprehensive screen', us: '$2,400', here: 'from $180 (coming soon)' },
    comingSoon: true,
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    city: 'Hong Kong',
    emoji: '🇭🇰',
    bgColor: '#F1EFE8',
    tagline: 'Advanced imaging, iconic city',
    why: 'Hong Kong\'s private hospitals are among Asia\'s most sophisticated. The city is compact and walkable, English is universal, and advanced diagnostics like CT scans are available rapidly.',
    visaNote: 'No visa required for US passport holders (up to 90 days)',
    bestTime: 'Oct–Dec (cool and clear)',
    flight: '~14–16 hours from US West Coast',
    currency: 'Hong Kong Dollar (HKD) · ~HK$7.8 per USD',
    tips: [
      'Octopus card covers MTR, buses, trams, and even 7-Eleven purchases.',
      'Adventist Hospital is in the Mid-Levels — easy taxi from Central.',
      'The Peak tram, Stanley Market, and Sai Kung for nature on non-hospital days.',
      'Dim sum breakfast is a must — City Hall Maxim\'s or Tim Ho Wan.',
      'Ferry to Macau (1 hr) makes for a great day trip.',
    ],
    packages: ['hk-adv'],
    usComparison: { test: 'Advanced screen + CT scan', us: '$4,500', here: 'from $580' },
  },
]

export default function DestinationsPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(DESTINATIONS[0])

  const destPackages = packages.filter(p => selected.packages.includes(p.id))

  return (
    <div className="site-shell">
      <TopBar />

      <div className="page-header">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Destinations' },
        ]} />
        <h1>Choose your destination</h1>
        <div className="subtitle">Eight countries, all with English-speaking hospitals and proven results</div>
      </div>

      <div className="two-col" style={{ gridTemplateColumns: '1fr 200px' }}>
        <div className="main-col">

          {/* Destination picker grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
            {DESTINATIONS.map(d => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                style={{
                  background: selected.id === d.id ? d.bgColor : '#f9f9f7',
                  border: selected.id === d.id ? '2px solid var(--hch-green-800)' : 'var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                  position: 'relative',
                }}
              >
                {d.comingSoon && (
                  <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 8, background: '#888', color: '#fff', padding: '1px 4px', borderRadius: 3 }}>Soon</span>
                )}
                <div style={{ fontSize: 22, marginBottom: 4 }}>{d.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: selected.id === d.id ? 500 : 400, color: selected.id === d.id ? 'var(--hch-green-800)' : '#333' }}>{d.name}</div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div style={{ background: selected.bgColor, borderRadius: 'var(--radius-lg)', padding: '18px 20px', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 40 }}>{selected.emoji}</span>
              <div>
                <h2 style={{ fontSize: 20, marginBottom: 3 }}>{selected.name} · {selected.city}</h2>
                <div style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>{selected.tagline}</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#333', lineHeight: 1.7, marginTop: 12 }}>{selected.why}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
              <MetaChip label="Visa" value={selected.visaNote} />
              <MetaChip label="Best time to visit" value={selected.bestTime} />
              <MetaChip label="Flight from US" value={selected.flight} />
              <MetaChip label="Currency" value={selected.currency} />
            </div>
          </div>

          {/* Tips */}
          <div style={{ marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Tips for {selected.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selected.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#444', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--hch-green-600)', fontWeight: 500, flexShrink: 0 }}>→</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Available packages */}
          {destPackages.length > 0 ? (
            <div>
              <div className="section-label" style={{ marginBottom: 8 }}>Packages in {selected.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {destPackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className="card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/shop/${pkg.id}`)}
                  >
                    <div style={{ height: 60, background: pkg.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                      {pkg.emoji}
                    </div>
                    <div className="card-body">
                      <div style={{ fontSize: 10, color: '#888' }}>{pkg.city} · {pkg.tier}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, margin: '2px 0 4px' }}>
                        {capitalize(pkg.tier)} health check
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--hch-green-800)' }}>${pkg.price}<span style={{ fontSize: 10, color: '#888', fontWeight: 400 }}>/person</span></div>
                        <div style={{ fontSize: 11, color: '#888' }}>★ {pkg.rating}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="inset">
              Packages for {selected.name} are coming soon. <a href="/shop">Browse all available destinations →</a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="side-col">

          {/* Cost comparison */}
          <div style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Cost comparison</div>
            <div style={{ border: 'var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <div style={{ background: '#f9f9f7', padding: '8px 10px', borderBottom: 'var(--border)', fontSize: 11, color: '#555' }}>
                {selected.usComparison.test}
              </div>
              <div style={{ padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: '#888' }}>US out-of-pocket</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#D85A30' }}>{selected.usComparison.us}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888' }}>In {selected.name}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--hch-green-800)' }}>{selected.usComparison.here}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick facts */}
          <div style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Quick facts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <FactRow label="Visa" value={selected.visaNote.split(' (')[0]} />
              <FactRow label="Flight" value={selected.flight.split(' from')[0]} />
              <FactRow label="Best time" value={selected.bestTime.split(' ·')[0]} />
              <FactRow label="Language" value="English available" />
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => navigate('/shop')}
          >
            Browse packages
          </button>

          <button
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
            onClick={() => navigate('/search' + (selected.id !== 'vietnam' ? `?dest=${selected.name}` : ''))}
          >
            Search {selected.name}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function MetaChip({ label, value }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.65)', borderRadius: 'var(--radius-sm)', padding: '7px 10px', fontSize: 12 }}>
      <div style={{ fontSize: 10, color: '#777', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#222' }}>{value}</div>
    </div>
  )
}

function FactRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '5px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ color: '#333', fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{value}</span>
    </div>
  )
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
