// Data for the 10-step /book flow. Japan is the only live destination —
// other countries are shown greyed out for realism. Clinics and packages
// are fetched live from Supabase (see src/lib/supabase.js) — only the
// generic/static parts of the flow (countries, prep tips, leisure content)
// stay hardcoded here.

export const COUNTRIES = [
  { id: 'japan', name: 'Japan', flag: '🗾', tagline: 'World-leading diagnostics · Tokyo', active: true },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', tagline: 'English-first · No visa required', active: false },
  { id: 'south-korea', name: 'South Korea', flag: '🇰🇷', tagline: 'Executive check-ups · Seoul', active: false },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭', tagline: 'Best value · Bangkok', active: false },
  { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼', tagline: 'Underrated gem · Taipei', active: false },
  { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', tagline: 'Most affordable · Kuala Lumpur', active: false },
  { id: 'hong-kong', name: 'Hong Kong', flag: '🇭🇰', tagline: 'Advanced tier · English-speaking', active: false },
  { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', tagline: 'Emerging destination', active: false },
]

export const PREP_INSTRUCTIONS = [
  'Fast for 8 hours before your appointment — water only, no coffee, juice, or food.',
  'Bring your passport and booking confirmation email — required for all international patients.',
  'Wear comfortable, loose-fitting clothing for ease during the ECG and blood draw.',
  'Avoid strenuous exercise and alcohol for 24 hours before your screening.',
  'Arrive 15 minutes early to complete check-in at the International Centre.',
]

export const INTEREST_CATEGORIES = [
  { id: 'culture', label: 'Culture & Temples', emoji: '⛩️' },
  { id: 'food', label: 'Food & Dining', emoji: '🍜' },
  { id: 'nature', label: 'Nature & Parks', emoji: '🌳' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'nightlife', label: 'Nightlife & Bars', emoji: '🌃' },
  { id: 'wellness', label: 'Wellness & Onsen', emoji: '♨️' },
  { id: 'family', label: 'Family-friendly', emoji: '👨‍👩‍👧' },
  { id: 'art', label: 'Art & Museums', emoji: '🎨' },
  { id: 'daytrips', label: 'Day trips', emoji: '🚄' },
]

export const ACTIVITY_POOL = {
  culture: ['Senso-ji Temple, Asakusa', 'Meiji Shrine', 'Imperial Palace East Gardens'],
  food: ['Tsukiji Outer Market food tour', 'Omoide Yokocho yakitori alley', 'Shinjuku ramen crawl'],
  nature: ['Shinjuku Gyoen National Garden', 'Mount Takao day hike', 'Hamarikyu Gardens'],
  shopping: ['Ginza flagship stores', 'Shibuya streetwear', 'Nakamise-dori souvenirs'],
  nightlife: ['Golden Gai bar hopping', 'Shibuya Sky sunset & bar', 'Roppongi izakaya night'],
  wellness: ['Hakone onsen day trip', 'Traditional sento bathhouse', 'Spa LaQua Tokyo Dome'],
  family: ['teamLab Planets, Toyosu', 'Ueno Zoo', 'Tokyo Disneyland'],
  art: ['Mori Art Museum', 'teamLab Borderless', 'Tokyo National Museum'],
  daytrips: ['Kamakura day trip', 'Nikko day trip', 'Kawagoe "Little Edo"'],
}

export const COMPLIANCE_ITEMS = [
  { id: 'fasting', label: 'I will arrive fasting for at least 8 hours before my appointment (water only).' },
  { id: 'consent', label: 'I consent to sharing my health information with the partner hospital for scheduling and screening purposes.' },
  { id: 'accuracy', label: 'I confirm that all information provided is accurate to the best of my knowledge.' },
]

// Fills a 3x3 (9-cell) itinerary preview by cycling through the activity
// pools of the selected interests, round-robin, until 9 cells are filled.
export const buildItineraryPreview = (interestIds) => {
  if (interestIds.length === 0) return []
  const cells = []
  let round = 0
  while (cells.length < 9) {
    let addedThisRound = false
    for (const id of interestIds) {
      const pool = ACTIVITY_POOL[id] || []
      if (pool.length === 0) continue
      cells.push({ interestId: id, activity: pool[round % pool.length] })
      addedThisRound = true
      if (cells.length >= 9) break
    }
    if (!addedThisRound) break
    round += 1
  }
  return cells.slice(0, 9)
}
