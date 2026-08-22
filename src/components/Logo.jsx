export default function Logo({ size = 32 }) {
  return (
    <img
      src="/logo-icon.png"
      alt="Health Check Holidays"
      width={size}
      height={size}
      style={{ width: size, height: 'auto', display: 'block' }}
    />
  )
}
