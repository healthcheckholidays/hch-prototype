export default function CostTicket() {
  return (
    <div className="cost-ticket">
      <style>{`
        .cost-ticket {
          margin-top: 8px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 18px 40px -22px rgba(0,0,0,0.5);
        }
        .cost-ticket .stubs {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          background: #fff;
        }
        .cost-ticket .stub { padding: 28px 32px; }
        .cost-ticket .field-label {
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8a9a93;
          font-weight: 600;
        }
        .cost-ticket .place {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          font-size: 1.3rem;
          margin-top: 6px;
          color: #145247;
        }
        .cost-ticket .amount {
          font-variant-numeric: tabular-nums;
          font-size: clamp(1.9rem, 3vw, 2.4rem);
          font-weight: 700;
          margin-top: 16px;
          color: #145247;
        }
        .cost-ticket .fine {
          margin-top: 10px;
          font-size: 0.85rem;
          color: #667;
          max-width: 28ch;
        }
        .cost-ticket .kind {
          display: inline-block;
          margin-top: 14px;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border: 1px solid #e2e2e2;
          border-radius: 999px;
          color: #8a8a8a;
        }
        .cost-ticket .stub.to .kind {
          color: #d9920a;
          border-color: rgba(250,168,5,0.4);
        }
        .cost-ticket .perf {
          position: relative;
          width: 1px;
          background-image: repeating-linear-gradient(180deg, #e2e2e2 0 10px, transparent 10px 20px);
        }
        .cost-ticket .perf::before,
        .cost-ticket .perf::after {
          content: "";
          position: absolute;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: var(--ticket-page-bg, #145247);
          left: 50%; transform: translateX(-50%);
        }
        .cost-ticket .perf::before { top: -10px; }
        .cost-ticket .perf::after { bottom: -10px; }
        .cost-ticket .save-strip {
          padding: 16px 32px;
          background: #0e3a32;
          color: #fff;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cost-ticket .save-strip .label {
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.75;
        }
        .cost-ticket .save-strip .num {
          font-variant-numeric: tabular-nums;
          font-size: 1.2rem;
          font-weight: 700;
          color: #FAA805;
        }
        @media (max-width: 640px) {
          .cost-ticket .stubs { grid-template-columns: 1fr; }
          .cost-ticket .perf {
            width: auto; height: 1px;
            background-image: repeating-linear-gradient(90deg, #e2e2e2 0 10px, transparent 10px 20px);
          }
          .cost-ticket .perf::before { top: 50%; left: -10px; transform: translateY(-50%); }
          .cost-ticket .perf::after { bottom: auto; top: 50%; left: auto; right: -10px; transform: translateY(-50%); }
        }
      `}</style>
      <div className="stubs">
        <div className="stub from">
          <p className="field-label">Screening only</p>
          <p className="place">San Francisco</p>
          <p className="amount">$50,000</p>
          <p className="fine">Family of four, clinic visit only — no travel, no time away.</p>
          <span className="kind">At home</span>
        </div>
        <div className="perf" aria-hidden="true" />
        <div className="stub to">
          <p className="field-label">Screening + holiday</p>
          <p className="place">Taiwan</p>
          <p className="amount">$25,000</p>
          <p className="fine">Family of four — flights, hotels, and equivalent screenings, included.</p>
          <span className="kind">Away</span>
        </div>
      </div>
      <div className="save-strip">
        <span className="label">Difference</span>
        <span className="num">$25,000 saved — plus a holiday</span>
      </div>
    </div>
  )
}
