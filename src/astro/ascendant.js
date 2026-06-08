import { SIGNS } from './constants.js';
import { calculateLahiriAyanamsha } from './swisseph-init.js';

export function calculateAscendant(swe, jd, lat, lng) {
  // swe.calculateHouses(jd, lat, lng, houseSystemFlag)
  // 'W' = Whole sign houses (traditional Vedic)
  
  // Actually, we'll calculate Placidus or just use Ascendant degree.
  // In Whole Sign, the 1st house is the entire sign the Ascendant falls into.
  const houseData = swe.calculateHouses(jd, lat, lng, 'P');
  const ayanamsha = calculateLahiriAyanamsha(jd);
  
  // Ascendant is usually the first item in the houses array or specifically returned
  const siderealAscendant = (houseData.ascendant - ayanamsha + 360) % 360;
  
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
