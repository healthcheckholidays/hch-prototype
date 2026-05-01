// Each itinerary is an array of day objects.
// type: 'health' | 'explore' | 'food' | 'travel'

export const itineraries = {
  'tokyo-7day': {
    destination: 'Japan · Tokyo',
    title: 'Tokyo Comprehensive Health Check — 7-day itinerary',
    hospital: "St. Luke's International Hospital",
    hospitalAddress: '9-1 Akashi-cho, Chuo-ku, Tokyo',
    appointmentTime: '07:30',
    appointmentDay: 3,
    coordinatorPhone: '+44 20 7946 0845',
    hospitalPhone: '+81 3-5550-7166',
    days: [
      {
        day: 1,
        label: 'Arrival',
        date: 'Saturday 14 June',
        isHealthDay: false,
        preDayTip: null,
        events: [
          { time: 'Arrival', type: 'travel', title: 'Land at Narita or Haneda Airport', description: 'Take the Narita Express (55 min) or Keikyu Line to central Tokyo. IC card (Suica/Pasmo) recommended for all transit.' },
          { time: 'Afternoon', type: 'explore', title: 'Check in — Shinjuku or Ginza area', description: 'Rest and acclimatise. Hotel in Chuo or Shinjuku puts you 15 min from St. Luke\'s Hospital by taxi or metro.' },
          { time: 'Evening', type: 'food', title: 'Tsukiji Outer Market — dinner', description: '5-minute walk from St. Luke\'s. Fresh sushi, sashimi, tamagoyaki. Avoid alcohol — hospital is in 2 days.' },
        ],
      },
      {
        day: 2,
        label: 'Explore Tokyo',
        date: 'Sunday 15 June',
        isHealthDay: false,
        preDayTip: { label: 'Before your screening tomorrow', text: 'Eat normally today — no restrictions yet. Drink plenty of water. Avoid strenuous exercise. Light alcohol only and stop by 9pm.' },
        events: [
          { time: '09:00', type: 'explore', title: 'Senso-ji Temple, Asakusa', description: 'Tokyo\'s oldest temple. Arrive early before crowds. Nakamise-dori shopping street alongside.' },
          { time: '11:30', type: 'food', title: 'Lunch in Ueno — ramen or bento', description: 'Ueno Park area has excellent casual dining. Try Ippudo ramen or pick up a bento from Ameyoko market.' },
          { time: '13:30', type: 'explore', title: 'Shibuya Crossing & surrounds', description: 'Iconic scramble crossing, Hachiko statue, Shibuya Sky observation deck. Allow 2–3 hours.' },
          { time: '19:00', type: 'food', title: 'Early dinner — Shinjuku Omoide Yokocho', description: '"Memory Lane" — tiny yakitori stalls in alleyway. Finish by 21:00. Begin fasting after dinner.', tags: ['Fast begins 21:00'] },
        ],
      },
      {
        day: 3,
        label: 'Health check day',
        date: 'Monday 16 June',
        isHealthDay: true,
        preDayTip: null,
        events: [
          { time: '06:45', type: 'travel', title: 'Depart hotel by taxi', description: 'Allow extra time. Show driver the hospital card included in your booking pack. Water is permitted right up until arrival.' },
          { time: '07:30', type: 'health', title: "Arrive St. Luke's — International Centre, 2F", description: 'Check in at reception. Present booking confirmation. A coordinator will guide you through blood draw, ECG, X-ray, and consultation. English-speaking throughout.', tags: ['Health check'] },
          { time: '~12:30', type: 'health', title: 'Physician review & debrief', description: 'A doctor walks through any immediately available results. Full written results sent within 48 hours.', tags: ['Health check'] },
          { time: '13:30', type: 'food', title: 'Post-screening lunch — Tsukiji or Ginza', description: 'You\'ve earned it. Tsukiji Outer Market is 5 min by taxi. Eat well — you\'ve been fasting since last night.' },
          { time: 'Afternoon', type: 'explore', title: 'Imperial Palace East Gardens or Ginza', description: 'Easy, calm afternoon. Imperial Palace gardens are a short walk. Ginza for shopping or Mori Art Museum.' },
        ],
      },
      {
        day: 4,
        label: 'Kyoto day trip',
        date: 'Tuesday 17 June',
        isHealthDay: false,
        preDayTip: null,
        events: [
          { time: '07:00', type: 'travel', title: 'Shinkansen to Kyoto (2h 15min)', description: 'Nozomi from Tokyo Station. Book in advance — reserved seats recommended. Right side for Mt. Fuji views.' },
          { time: 'Morning', type: 'explore', title: 'Fushimi Inari Shrine', description: 'Thousands of torii gates winding up Mt. Inari. Arrive early (07:30) to beat crowds. 20 min from Kyoto Station.' },
          { time: 'Afternoon', type: 'explore', title: 'Arashiyama Bamboo Grove & Gion', description: 'Bamboo grove at Tenryu-ji, then Gion district in the evening for a chance to see geiko.' },
          { time: 'Evening', type: 'food', title: 'Dinner in Kyoto — Nishiki Market area', description: 'Kyoto-style kaiseki or casual izakaya around Pontocho alley. Last shinkansen back to Tokyo ~22:00.' },
        ],
      },
      {
        day: 5,
        label: 'Nara & return',
        date: 'Wednesday 18 June',
        isHealthDay: false,
        preDayTip: null,
        events: [
          { time: '09:00', type: 'explore', title: 'Nara day trip — Todai-ji Temple & deer park', description: '45 min by express train from Kyoto. Free-roaming deer, enormous Great Buddha. Back to Tokyo by evening.' },
          { time: 'Evening', type: 'food', title: 'Tokyo — dinner in Shibuya or Roppongi', description: 'Celebrate the halfway point. Roppongi has great international dining if you want a break from Japanese food.' },
        ],
      },
      {
        day: 6,
        label: 'Tokyo & results',
        date: 'Thursday 19 June',
        isHealthDay: false,
        preDayTip: null,
        events: [
          { time: 'Morning', type: 'health', title: 'Full health results arrive by email', description: 'Your results and plain-English summary will be in your inbox by now (within 48 hrs of Day 3 screening). If anything needs follow-up, our coordinator arranges a teleconsult.', tags: ['Results'] },
          { time: '10:00', type: 'explore', title: 'TeamLab Planets, Toyosu', description: 'World-renowned digital art museum. Book ahead online. Allow 2 hours. 20 min from central Tokyo.' },
          { time: 'Afternoon', type: 'explore', title: 'Odaiba waterfront', description: 'Views of Rainbow Bridge, teamLab Borderless (reopened 2024), Gundam statue, Palette Town.' },
          { time: 'Evening', type: 'food', title: 'Farewell dinner — Shinjuku', description: 'Kabukicho area for a final Tokyo night out, or a rooftop bar in Shinjuku for city views.' },
        ],
      },
      {
        day: 7,
        label: 'Departure',
        date: 'Friday 20 June',
        isHealthDay: false,
        preDayTip: null,
        events: [
          { time: 'Morning', type: 'explore', title: 'Final morning — Meiji Shrine or Harajuku', description: 'If time allows. Meiji Shrine is peaceful and takes about an hour. Harajuku\'s Takeshita Street opens 11am.' },
          { time: 'Midday', type: 'travel', title: 'Check out & depart for airport', description: 'Check out by 11:00. Most Tokyo hotels offer free luggage storage until departure. Narita Express ~55 min to airport. Allow 2 hours before flight.' },
        ],
      },
    ],
  },
}

export const getItinerary = (id) => itineraries[id]
