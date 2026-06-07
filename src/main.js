import { initEphemeris, dateToJulianDay } from './astro/swisseph-init.js';
import { calculatePlanets } from './astro/planets.js';
import { calculateAscendant, mapToHouses } from './astro/ascendant.js';
import { generateD9Chart } from './astro/navamsha.js';
import { calculateDasha } from './astro/dasha.js';
import { renderRashiChart } from './charts/rashi-chart.js';
import { renderNavamshaChart } from './charts/navamsha-chart.js';
import { renderPlanetTable } from './ui/planet-table.js';
import { renderDashaTimeline } from './dasha/dasha-display.js';
let swe = null;

async function initializeApp() {
  // Populate Day Dropdown
  const daySelect = document.getElementById('dob-day');
  for (let i = 1; i <= 31; i++) {
    const val = i.toString().padStart(2, '0');
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = val;
    daySelect.appendChild(opt);
  }
  
  // Populate Year Dropdown (1900 to current year)
  const yearSelect = document.getElementById('dob-year');
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 1900; i--) {
    const opt = document.createElement('option');
    opt.value = i.toString();
    opt.textContent = i.toString();
    yearSelect.appendChild(opt);
  }

  try {
    swe = await initEphemeris();
    console.log("Swiss Ephemeris loaded successfully");
  } catch (err) {
    console.error("Failed to load Swiss Ephemeris:", err);
    alert("There was an error loading the astrology engine. Please try refreshing.");
  }
}

// Ensure init runs regardless of when module is executed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

document.getElementById('birth-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!swe) {
    alert("Astrology engine is still loading. Please wait a moment and try again.");
    return;
  }
  
  const dd = document.getElementById('dob-day').value;
  const mm = document.getElementById('dob-month').value;
  const yy = document.getElementById('dob-year').value;
  const date = `${yy}-${mm}-${dd}`;
  
  const time = document.getElementById('time').value;
  const cityName = document.getElementById('city').value;
  
  // Hardcode Timezone to Indian Standard Time (IST)
  const tz = 5.5; 
  
  // Show Loading
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');
  
  try {
    // Geocode City Name via Nominatim
    const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`);
    const geocodeData = await geocodeRes.json();
    
    if (!geocodeData || geocodeData.length === 0) {
      alert("City not found. Please enter a valid city name (e.g. 'Mumbai, India').");
      document.getElementById('loading').classList.add('hidden');
      return;
    }
    
    const lat = parseFloat(geocodeData[0].lat);
    const lng = parseFloat(geocodeData[0].lon);

    // 1. Calculate Julian Day
    const jd = dateToJulianDay(date, time, tz);
    
    // 2. Ascendant (Lagna)
    const ascendant = calculateAscendant(swe, jd, lat, lng);
    
    // 3. Planets
    let planets = calculatePlanets(swe, jd);
    
    // 4. Map to D1 Houses
    planets = mapToHouses(planets, ascendant.signIndex);
    
    // 5. Navamsha (D9) Chart
    const { d9Planets, d9AscendantSignIndex } = generateD9Chart(planets, ascendant.longitude);
    
    // 6. Vimshottari Dasha
    const birthDateObj = new Date(`${date}T${time}:00`);
    // Adjust birthDateObj to local time accounting for the user's input timezone
    // The browser might assume local TZ, so we need to be careful if we want accurate Dasha dates.
    // For simplicity, we just use local browser timezone for displaying dates in this demo.
    const dasha = calculateDasha(planets.MOON.longitude, birthDateObj);
    
    // Render UI
    renderRashiChart('d1-chart', planets, ascendant.signIndex);
    renderNavamshaChart('d9-chart', d9Planets, d9AscendantSignIndex);
    renderPlanetTable('planet-table-section', planets, ascendant);
    renderDashaTimeline('dasha-balance', 'dasha-timeline', dasha);
    
    // Hide Loading, Show Results
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    
  } catch (err) {
    console.error("Calculation Error:", err);
    alert("Error calculating charts. Please check the console for details.");
    document.getElementById('loading').classList.add('hidden');
  }
});
