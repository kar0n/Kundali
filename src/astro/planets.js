import { PLANETS, SIGNS, NAKSHATRAS } from './constants.js';
import { calculateLahiriAyanamsha } from './swisseph-init.js';

// Calculate positions for all planets
export function calculatePlanets(swe, jd) {
  // Use MoshierEphemeris (4) + Speed (256) for offline client-side calculation
  const flags = 4 | 256; 
  const ayanamsha = calculateLahiriAyanamsha(jd);
  const results = {};
  
  for (const [key, planetInfo] of Object.entries(PLANETS)) {
    let swePlanetId = planetInfo.id;
    let pos;
    
    if (planetInfo.id === 11) {
      // Ketu calculation: Rahu + 180 degrees
      const rahuPos = swe.calculatePosition(jd, 10, flags);
      const ketuLong = (rahuPos.longitude + 180) % 360;
      pos = {
        longitude: ketuLong,
        longitudeSpeed: rahuPos.longitudeSpeed // Ketu moves exactly opposite (same speed but relative)
      };
    } else {
      // Use SWISSEPH to calculate
      pos = swe.calculatePosition(jd, swePlanetId, flags);
    }
    
    // Process longitude into Rashi, degrees, Nakshatra (Vedic sidereal)
    const longitude = (pos.longitude - ayanamsha + 360) % 360;
    const isRetrograde = pos.longitudeSpeed < 0;
    
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
      speed: pos.longitudeSpeed || 0,
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
