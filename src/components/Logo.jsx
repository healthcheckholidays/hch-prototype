export default function Logo({ size = 32, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" aria-hidden="true">
      <path d="M13 2 L13 24 M4 8 L22 8" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M13 8 C13 8 6 13 6 18 C6 21.3 9.2 24 13 24 C16.8 24 20 21.3 20 18 C20 13 13 8 13 8Z"
        fill="none"
        stroke="#FAA805"
        strokeWidth="1.4"
        opacity="0.75"
      />
    </svg>
  )
}
