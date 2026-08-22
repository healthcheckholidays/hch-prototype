import { useState } from 'react'

export default function DemoNotice() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '32px',
          maxWidth: 380,
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--hch-green-800, #145247)', marginBottom: '12px' }}>
          Under Development
        </h2>
        <p style={{ color: '#444', lineHeight: 1.6, marginBottom: '24px' }}>
          Please contact info@go-hch.com for more details.
        </p>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'var(--hch-gold, #FAA805)',
            color: 'var(--hch-green-800, #145247)',
            fontWeight: 600,
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
