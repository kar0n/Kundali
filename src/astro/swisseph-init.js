import { SwissEphemeris } from '@swisseph/browser';

let sweInstance = null;

export async function initEphemeris() {
  if (sweInstance) return sweInstance;
  
  // Create instance and initialize
  sweInstance = new SwissEphemeris();
  await sweInstance.init();
  
  return sweInstance;
}

export function calculateLahiriAyanamsha(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  // Precise precession formula for Lahiri Ayanamsha (IAU 1976 model):
  // At J2000.0 (T = 0), Lahiri Ayanamsha was 23° 51' 25.532" = 23.85709222 degrees.
  const precession = (5029.0966 * T + 1.11161 * T * T - 0.000113 * T * T * T) / 3600.0;
  return 23.85709222 + precession;
}

export function dateToJulianDay(dateStr, timeStr, tzOffsetHours) {
  // Parse date and time
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hourStr, minStr] = timeStr.split(':');
  
  // Convert local time to UTC
  let hour = Number(hourStr) + (Number(minStr) / 60.0);
  hour -= tzOffsetHours; // Adjust for timezone
  
  // Normalize if hour goes out of bounds
  let utcDate = new Date(Date.UTC(year, month - 1, day));
  utcDate.setUTCHours(0, 0, 0, 0); // start of day
  // Add our decimal hours
  utcDate.setTime(utcDate.getTime() + hour * 3600 * 1000);
  
  const y = utcDate.getUTCFullYear();
  const m = utcDate.getUTCMonth() + 1;
  const d = utcDate.getUTCDate();
  const h = utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60.0;
  
  // We use the basic formula or rely on swisseph if it has a native utility.
  // Using standard formula for Julian Day
  let jy = y;
  let jm = m;
  if (m <= 2) {
    jy -= 1;
    jm += 12;
  }
  const a = Math.floor(jy / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (jy + 4716)) + Math.floor(30.6001 * (jm + 1)) + d + b - 1524.5 + (h / 24.0);
  
  return jd;
}
