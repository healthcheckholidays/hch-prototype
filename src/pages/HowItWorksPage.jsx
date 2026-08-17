import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, Footer, Breadcrumb } from '../components/Nav'
import { Timeline } from '../components/Timeline'

const STEPS = [
  {
    num: '01',
    title: 'Choose a package',
    body: 'Browse by destination, tier, or budget. Filter by JCI accreditation, English availability, duration, or specific tests. Every package page shows exactly what\'s included, which hospitals offer it, and how much you\'ll save versus US out-of-pocket costs.',
    detail: 'Three tiers: Essential (2 hrs, blood panel), Comprehensive (half-day, full workup), Advanced (full day, MRI/CT included).',
  },
  {
    num: '02',
    title: 'Reserve your slot',
    body: 'Select your travel dates and click "Reserve screening slot." We contact the hospital within one business day and confirm your appointment. No payment is taken until your slot is confirmed. Free cancellation up to 30 days before.',
    detail: 'You\'ll receive a booking reference (e.g. HCH-2025-0614) by email within 24 hours.',
  },
  {
    num: '03',
    title: 'Receive your pre-arrival guide',
    body: 'Once confirmed, we send a personalised pre-arrival guide: what to eat (and not eat) the day before, what to bring, how to get to the hospital from your hotel, and what to expect on the day.',
    detail: 'Fast for 8 hours before blood tests. Water only. Avoid strenuous exercise the day before.',
  },
  {
    num: '04',
    title: 'Spend half a day at the hospital',
    body: 'Check in at the international health centre with your passport and booking confirmation. A nurse or coordinator will guide you through each test. Most comprehensive screenings take 3–5 hours. You\'ll be back at your hotel in time for lunch.',
    detail: 'The hospital provides a locker, gown, and sometimes a light breakfast after your blood draw.',
  },
  {
    num: '05',
    title: 'Receive your results',
    body: 'All results are emailed within 48 hours — usually sooner. You receive the full technical report plus a plain-English summary that explains each result in plain language. If anything requires follow-up, a US-based teleconsult is included at no extra charge.',
    detail: 'Results are also stored in your Health Check Holidays account under Documents.',
  },
]

const SAMPLE_DAY = [
  { time: '07:00', type: 'travel', title: 'Leave hotel', description: 'Taxi or metro to the hospital. Aim to arrive 15 minutes early. Bring passport + booking confirmation email.' },
  { time: '07:30', type: 'health', title: 'Check in — international health centre', description: 'Reception registers you, verifies ID, and hands you a schedule for the morning. You\'re given a locker and a gown.', tags: ['Fasted arrival'] },
  { time: '07:45', type: 'health', title: 'Blood draw', description: 'A single blood draw covers the full panel — typically 6–8 vials. Takes about 10 minutes. A nurse explains what each test covers.' },
  { time: '08:00', type: 'health', title: 'ECG (resting)', description: '10 leads placed on chest and limbs. Completely painless. Takes 5–10 minutes. Results reviewed by cardiologist.' },
  { time: '08:15', type: 'health', title: 'Chest X-ray', description: 'Standing behind an X-ray panel. Takes under 2 minutes. Standard screen for lung and heart silhouette.' },
  { time: '08:30', type: 'health', title: 'Urinalysis + blood pressure + BMI', description: 'Three quick measurements. Nurse records results in your file.' },
  { time: '09:00', type: 'food', title: 'Light breakfast in hospital café', description: 'After blood draw is complete you can eat. Hospital cafeterias are clean and good. Or head outside — most hospitals are near cafés.', tags: ['Fast ends'] },
  { time: '10:00', type: 'health', title: 'Physician consultation', description: 'A doctor reviews your preliminary results, takes a medical history, and flags anything requiring attention. 15–30 minutes.' },
  { time: '10:45', type: 'travel', title: 'Check out', description: 'Coordinator gives you a discharge summary. Full results sent by email within 48 hours. You\'re done.' },
  { time: '11:00', type: 'explore', title: 'Back to your holiday', description: 'Rest of the day is yours. Most guests head to a nearby attraction, lunch spot, or simply back to the hotel for a well-earned rest.' },
]

const RESULT_TYPES = [
  { status: 'normal', dot: '#1D9E75', label: 'Normal (green)', desc: 'Your result is within the healthy reference range. No action needed.' },
  { status: 'amber', dot: '#BA7517', label: 'Borderline (amber)', desc: 'Slightly outside the ideal range. Worth monitoring and discussing at your next GP visit. Not alarming.' },
  { status: 'flagged', dot: '#D85A30', label: 'Flagged (red)', desc: 'Result needs prompt medical attention. We\'ll flag this clearly and connect you with a US-based teleconsult, included free.' },
]

const FAQS = [
  {
    q: 'Is the hospital quality genuinely comparable to the US?',
    a: 'Yes — every partner hospital is either JCI-accredited (Joint Commission International, the global gold standard for hospital quality) or holds equivalent certification. Many of our partner hospitals are ranked among Asia\'s top facilities. JCI accreditation requires the same standards as leading US hospitals.',
  },
  {
    q: 'Will staff speak English?',
    a: 'All partner hospitals have dedicated international health centres staffed entirely in English — reception, nurses, and physicians. Results and all written communication are in English. In Japan and Korea, some general signage may be in local language, but your dedicated health centre staff will handle everything.',
  },
  {
    q: 'What if something is flagged in my results?',
    a: 'Every package includes a free US-based teleconsult if any result requires follow-up. A physician will call or video-consult you within 3 business days of your results to explain the finding and advise on next steps. You\'ll never be left to interpret a concerning result alone.',
  },
  {
    q: 'What do I need to prepare before the screening?',
    a: 'Fast for 8 hours before your appointment (water only — no coffee, juice, or food). Bring your passport. Wear comfortable, loose-fitting clothing. A detailed pre-arrival guide is emailed once your booking is confirmed.',
  },
  {
    q: 'Can I bring a travel companion?',
    a: 'Yes. Most hospitals allow one companion into the health centre waiting area. Each person needs their own booking. The companion can also book a screening — we recommend partners book together for a shared health baseline.',
  },
  {
    q: 'How long does the screening take?',
    a: 'Essential packages take approximately 2 hours. Comprehensive packages take 3–5 hours (half a day). Advanced packages with MRI or CT scanning take 6–8 hours (full day). You\'ll be briefed on timing when your booking is confirmed.',
  },
  {
    q: 'Are my results private and secure?',
    a: 'Yes. Results are sent directly to your personal email and stored in your Health Check Holidays account. We do not share results with any third party, employer, or insurer. Your health data is encrypted and never sold.',
  },
  {
    q: 'Can I use my US health insurance?',
    a: 'Most US health insurance plans do not cover elective screenings abroad. However, the out-of-pocket cost of our packages is typically 80–90% less than the US equivalent, so most guests find the direct cost is lower than their US deductible. We provide a full invoice for your records.',
  },
]

export default function HowItWorksPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="site-shell">
      <TopBar />

      <div className="page-header">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'How it works' },
        ]} />
        <h1>How it works</h1>
        <div className="subtitle">From booking to results in five straightforward steps</div>
      </div>

      {/* 5-step process */}
      <div style={{ padding: '24px 24px 32px', borderBottom: 'var(--border)' }}>
        <div className="section-label" style={{ marginBottom: 16 }}>The process</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{ display: 'flex', gap: 16, paddingBottom: i < STEPS.length - 1 ? 0 : 0 }}>
              {/* Left: number + connector line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--hch-green-800)', color: '#fff',
                  fontSize: 13, fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {step.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: 'var(--hch-green-50)', minHeight: 24, marginTop: 4 }} />
                )}
              </div>

              {/* Right: content */}
              <div style={{ paddingBottom: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6, marginTop: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#444', lineHeight: 1.7, marginBottom: 8 }}>{step.body}</p>
                <div className="inset" style={{ marginTop: 0 }}>
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample check-up day timeline */}
      <div style={{ padding: '28px 24px', borderBottom: 'var(--border)', background: 'var(--hch-sky)' }}>
        <div className="section-label" style={{ marginBottom: 4 }}>Sample check-up day</div>
        <h2 style={{ marginBottom: 4 }}>What a typical morning looks like</h2>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
          Based on a Comprehensive package at a JCI hospital. Your actual schedule will be confirmed in your pre-arrival guide.
        </p>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
          {[
            { type: 'health', color: 'var(--hch-green-800)', label: 'Health check' },
            { type: 'explore', color: 'var(--hch-blue-400)', label: 'Sightseeing' },
            { type: 'food', color: 'var(--hch-amber-400)', label: 'Food & dining' },
            { type: 'travel', color: 'var(--hch-gray-400)', label: 'Travel' },
          ].map(l => (
            <div key={l.type} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#666' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
              {l.label}
            </div>
          ))}
        </div>

        <Timeline events={SAMPLE_DAY} />
      </div>

      {/* Results explained */}
      <div style={{ padding: '28px 24px', borderBottom: 'var(--border)' }}>
        <div className="section-label" style={{ marginBottom: 4 }}>Understanding your results</div>
        <h2 style={{ marginBottom: 8 }}>Plain English, not medical jargon</h2>
        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginBottom: 20 }}>
          Within 48 hours of your screening you receive two documents: the full technical report (identical to what your doctor would see)
          and a plain-English summary that translates every result into language anyone can understand.
          Each result is colour-coded so you can see at a glance what needs attention and what doesn't.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {RESULT_TYPES.map(r => (
            <div key={r.status} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', border: 'var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--hch-sand)' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: r.dot, flexShrink: 0, marginTop: 3 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{r.label}</div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="inset">
          <strong>Free teleconsult included:</strong> If any result is flagged, a US-based physician will contact you within
          3 business days to explain the finding and advise on next steps. This is included in every package at no extra charge.
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '28px 24px', borderBottom: 'var(--border)' }}>
        <div className="section-label" style={{ marginBottom: 4 }}>Frequently asked questions</div>
        <h2 style={{ marginBottom: 20 }}>Common questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: 'var(--border)' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0', textAlign: 'left', gap: 12,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{faq.q}</span>
                <span style={{ fontSize: 18, color: 'var(--hch-green-600)', flexShrink: 0, lineHeight: 1 }}>
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              {openFaq === i && (
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, paddingBottom: 14 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '32px 24px', textAlign: 'center', background: 'var(--hch-sand)' }}>
        <h2 style={{ marginBottom: 8 }}>Ready to get started?</h2>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
          Browse packages by destination or tier and reserve your screening slot in minutes.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>Browse packages</button>
          <button className="btn btn-outline" onClick={() => navigate('/destinations')}>Explore destinations</button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
