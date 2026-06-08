import { PLANETS, SIGNS, NAKSHATRAS } from './constants.js';
import { calculateLahiriAyanamsha } from './swisseph-init.js';

// Map our planet keys to astronomy-engine body names
const BODY_MAP = {
  SUN: 'Sun',
  MOON: 'Moon',
  MERCURY: 'Mercury',
  VENUS: 'Venus',
  MARS: 'Mars',
  JUPITER: 'Jupiter',
  SATURN: 'Saturn'
};

// Convert Julian Day to JS Date
function jdToDate(jd) {
  return new Date((jd - 2440587.5) * 86400000);
}

// Calculate Mean North Node (Rahu) longitude from Julian Day
function calculateMeanRahu(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  // Mean longitude of the ascending node (Rahu)
  let omega = 125.0445479
    - 1934.1362891 * T
    + 0.0020754 * T * T
    + T * T * T / 467441.0
    - T * T * T * T / 60616000.0;
  // Normalize to 0-360
  omega = ((omega % 360) + 360) % 360;
  return omega;
}

// Calculate positions for all planets
export function calculatePlanets(jd) {
  const ayanamsha = calculateLahiriAyanamsha(jd);
  const results = {};

  // Create AstroTime from JD
  const date = jdToDate(jd);
  const astroTime = Astronomy.MakeTime(date);

  // Also compute positions at jd ± 0.01 days for speed estimation
  const dateBefore = jdToDate(jd - 0.01);
  const dateAfter = jdToDate(jd + 0.01);
  const timeBefore = Astronomy.MakeTime(dateBefore);
  const timeAfter = Astronomy.MakeTime(dateAfter);

  for (const [key, planetInfo] of Object.entries(PLANETS)) {
    let tropicalLongitude;
    let speed = 0;
    let isRetrograde = false;

    if (key === 'RAHU') {
      // Mean North Node (always retrograde)
      tropicalLongitude = calculateMeanRahu(jd);
      const rahuBefore = calculateMeanRahu(jd - 0.01);
      const rahuAfter = calculateMeanRahu(jd + 0.01);
      speed = (rahuAfter - rahuBefore) / 0.02;
      // Handle wrap-around
      if (Math.abs(speed) > 180) {
        speed = speed > 0 ? speed - 360 : speed + 360;
      }
      isRetrograde = true;
    } else if (key === 'KETU') {
      // Ketu = Rahu + 180° (always retrograde)
      tropicalLongitude = (calculateMeanRahu(jd) + 180) % 360;
      const ketuBefore = (calculateMeanRahu(jd - 0.01) + 180) % 360;
      const ketuAfter = (calculateMeanRahu(jd + 0.01) + 180) % 360;
      speed = (ketuAfter - ketuBefore) / 0.02;
      if (Math.abs(speed) > 180) {
        speed = speed > 0 ? speed - 360 : speed + 360;
      }
      isRetrograde = true;
    } else {
      // Use astronomy-engine for standard planets
      const bodyName = BODY_MAP[key];

      // Geocentric vector with aberration (light-time correction)
      const geoVec = Astronomy.GeoVector(bodyName, astroTime, true);
      const eclip = Astronomy.Ecliptic(geoVec);
      tropicalLongitude = eclip.elon;

      // Compute speed via numerical differentiation
      const geoVecBefore = Astronomy.GeoVector(bodyName, timeBefore, true);
      const geoVecAfter = Astronomy.GeoVector(bodyName, timeAfter, true);
      const longBefore = Astronomy.Ecliptic(geoVecBefore).elon;
      const longAfter = Astronomy.Ecliptic(geoVecAfter).elon;
      
      speed = (longAfter - longBefore) / 0.02;
      // Handle wrap-around at 0°/360°
      if (Math.abs(speed) > 180) {
        speed = speed > 0 ? speed - 360 : speed + 360;
      }
      isRetrograde = speed < 0;
    }

    // Process longitude into Rashi, degrees, Nakshatra (Vedic sidereal)
    const longitude = (tropicalLongitude - ayanamsha + 360) % 360;

    // Sign calculations
    const signIndex = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;

    // Nakshatra calculations (each is 13°20' = 13.333333°)
    const nakshatraLength = 360 / 27;
    const nakshatraIndex = Math.floor(longitude / nakshatraLength);
    const degreeInNakshatra = longitude % nakshatraLength;

    // Pada calculations (each nakshatra has 4 padas)
    const padaLength = nakshatraLength / 4;
    const pada = Math.floor(degreeInNakshatra / padaLength) + 1;

    results[key] = {
      ...planetInfo,
      longitude,
      speed: speed || 0,
      isRetrograde,
      signIndex,
      signName: SIGNS[signIndex].name,
      signSanskrit: SIGNS[signIndex].sanskrit,
      degreeInSign,
      nakshatraIndex,
      nakshatraName: NAKSHATRAS[nakshatraIndex],
      degreeInNakshatra,
      pada
    };
  }

  return results;
}
