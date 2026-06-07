export const SIGNS = [
  { id: 0, name: 'Aries', sanskrit: 'Mesha', ruler: 'Mars' },
  { id: 1, name: 'Taurus', sanskrit: 'Vrishabha', ruler: 'Venus' },
  { id: 2, name: 'Gemini', sanskrit: 'Mithuna', ruler: 'Mercury' },
  { id: 3, name: 'Cancer', sanskrit: 'Karka', ruler: 'Moon' },
  { id: 4, name: 'Leo', sanskrit: 'Simha', ruler: 'Sun' },
  { id: 5, name: 'Virgo', sanskrit: 'Kanya', ruler: 'Mercury' },
  { id: 6, name: 'Libra', sanskrit: 'Tula', ruler: 'Venus' },
  { id: 7, name: 'Scorpio', sanskrit: 'Vrishchika', ruler: 'Mars' },
  { id: 8, name: 'Sagittarius', sanskrit: 'Dhanus', ruler: 'Jupiter' },
  { id: 9, name: 'Capricorn', sanskrit: 'Makara', ruler: 'Saturn' },
  { id: 10, name: 'Aquarius', sanskrit: 'Kumbha', ruler: 'Saturn' },
  { id: 11, name: 'Pisces', sanskrit: 'Meena', ruler: 'Jupiter' }
];

export const PLANETS = {
  SUN: { id: 0, name: 'Sun', abbr: 'Su', color: '#ffb347' },
  MOON: { id: 1, name: 'Moon', abbr: 'Mo', color: '#c9c9ff' },
  MERCURY: { id: 2, name: 'Mercury', abbr: 'Me', color: '#77dd77' },
  VENUS: { id: 3, name: 'Venus', abbr: 'Ve', color: '#fdfd96' },
  MARS: { id: 4, name: 'Mars', abbr: 'Ma', color: '#ff6961' },
  JUPITER: { id: 5, name: 'Jupiter', abbr: 'Ju', color: '#f8d66d' },
  SATURN: { id: 6, name: 'Saturn', abbr: 'Sa', color: '#84b6f4' },
  RAHU: { id: 10, name: 'Rahu', abbr: 'Ra', color: '#a0785a' },
  KETU: { id: 11, name: 'Ketu', abbr: 'Ke', color: '#9e9e9e' }
};

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const DASHA_LORDS = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 }
];

export const NAKSHATRA_TO_DASHA_INDEX = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, // 1-9
  0, 1, 2, 3, 4, 5, 6, 7, 8, // 10-18
  0, 1, 2, 3, 4, 5, 6, 7, 8  // 19-27
];
