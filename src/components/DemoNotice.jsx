import { useState } from 'react'

export default function DemoNotice() {
  const [dismissed, setDismissed] = useState(false)
  const [understood, setUnderstood] = useState(false)

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
          maxWidth: 440,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--hch-green-800, #145247)',
            marginBottom: '14px',
            textAlign: 'center',
          }}
        >
          Under Development
        </h2>
        <p style={{ color: '#444', lineHeight: 1.6, marginBottom: '14px' }}>
          Please explore — if you have any issues, let us know at{' '}
          <a
            href="mailto:info@go-hch.com"
            style={{ color: 'var(--hch-green-800, #145247)', fontWeight: 600 }}
          >
            info@go-hch.com
          </a>
          , but please note:
        </p>
        <p
          style={{
            background: '#fff4e0',
            border: '1px solid rgba(250,168,5,0.4)',
            borderRadius: 8,
            padding: '12px 14px',
            color: '#7a4e00',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            marginBottom: '20px',
          }}
        >
          <strong>Do not provide any personal information or payment information into this
          demonstrator.</strong> This includes your real name, address, contact details, medical
          or health information, or card/payment details. Anything you enter is for
          demonstration purposes only — it stays in your browser and is never sent to us, stored,
          or shared.
        </p>
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 20,
            fontSize: '0.9rem',
            color: '#333',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
            style={{ marginTop: 3 }}
          />
          I understand this statement
        </label>
        <button
          onClick={() => understood && setDismissed(true)}
          disabled={!understood}
          style={{
            background: understood ? 'var(--hch-gold, #FAA805)' : '#e2e2e2',
            color: understood ? 'var(--hch-green-800, #145247)' : '#999',
            fontWeight: 600,
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            width: '100%',
            cursor: understood ? 'pointer' : 'not-allowed',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
