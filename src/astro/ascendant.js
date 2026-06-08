import { SIGNS } from './constants.js';
import { calculateLahiriAyanamsha } from './swisseph-init.js';

export function calculateAscendant(jd, lat, lng) {
  // Convert JD to JS Date and AstroTime
  const date = new Date((jd - 2440587.5) * 86400000);
  const astroTime = Astronomy.MakeTime(date);

  // Greenwich Mean Sidereal Time (in hours)
  const gmst = Astronomy.SiderealTime(astroTime);

  // Local Sidereal Time (in hours)
  const lst = gmst + lng / 15.0;

  // Right Ascension of Medium Coeli (in degrees)
  const ramc = lst * 15.0;

  // Obliquity of the ecliptic
  const T = (jd - 2451545.0) / 36525.0;
  const obliquity = 23.4392911 - 0.0130042 * T;

  // Convert to radians for trig
  const ramcRad = (ramc * Math.PI) / 180.0;
  const oblRad = (obliquity * Math.PI) / 180.0;
  const latRad = (lat * Math.PI) / 180.0;

  // Ascendant formula
  const ascRad = Math.atan2(
    Math.cos(ramcRad),
    -(Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad))
  );

  // Convert to degrees and normalize to 0-360
  let tropicalAscendant = ((ascRad * 180.0) / Math.PI + 360) % 360;

  // Apply Lahiri Ayanamsha for sidereal
  const ayanamsha = calculateLahiriAyanamsha(jd);
  const siderealAscendant = (tropicalAscendant - ayanamsha + 360) % 360;

  const signIndex = Math.floor(siderealAscendant / 30);
  const degreeInSign = siderealAscendant % 30;

  return {
    longitude: siderealAscendant,
    signIndex,
    signName: SIGNS[signIndex].name,
    signSanskrit: SIGNS[signIndex].sanskrit,
    degreeInSign
  };
}

// Maps planets to their Whole Sign Houses based on Ascendant
export function mapToHouses(planets, ascendantSignIndex) {
  const housedPlanets = { ...planets };
  
  for (const key in housedPlanets) {
    const p = housedPlanets[key];
    // Whole Sign House formula
    let houseIndex = (p.signIndex - ascendantSignIndex + 12) % 12;
    p.house = houseIndex + 1; // 1-indexed house
  }
  
  return housedPlanets;
}
