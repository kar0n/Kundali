import swisseph from '@swisseph/browser';

let sweInstance = null;

export async function initEphemeris() {
  if (sweInstance) return sweInstance;
  
  // Create instance and initialize
  sweInstance = new swisseph.SwissEphemeris();
  await sweInstance.init();
  
  // Set Ayanamsha to Lahiri (Chitrapaksha)
  // SE_SIDM_LAHIRI = 1
  sweInstance.setSiderealMode(1, 0, 0);
  
  return sweInstance;
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
