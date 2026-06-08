import { dateToJulianDay } from './astro/swisseph-init.js';
import { calculatePlanets } from './astro/planets.js';
import { calculateAscendant, mapToHouses } from './astro/ascendant.js';
import { generateD9Chart } from './astro/navamsha.js';
import { calculateDasha } from './astro/dasha.js';
import { renderRashiChart } from './charts/rashi-chart.js';
import { renderNavamshaChart } from './charts/navamsha-chart.js';
import { renderPlanetTable } from './ui/planet-table.js';
import { renderDashaTimeline } from './dasha/dasha-display.js';
import { renderInterpretation } from './ui/interpretation.js';

// ── Generate Kundali handler ──
// Exposed as a global so the inline script's form handler can call it
// even though this is a module (modules don't pollute the global scope).
window.__generateKundali = async function () {
  if (typeof Astronomy === 'undefined') {
    alert('Astrology engine is still loading. Please wait a moment and try again.');
    return;
  }

  // ── Read Date ──
  const dateVal = document.getElementById('dob-input').value;
  if (!dateVal) {
    alert('Please select your date of birth.');
    return;
  }
  const date = dateVal;

  // ── Read Time (12-hour → 24-hour) ──
  const hourVal = document.getElementById('tob-hour').value;
  const minVal = document.getElementById('tob-minute').value;
  const period = document.getElementById('tob-period').value;

  if (!hourVal || !minVal || !period) {
    alert('Please select your complete time of birth.');
    return;
  }

  let hour24 = parseInt(hourVal, 10);
  if (period === 'AM' && hour24 === 12) hour24 = 0;
  if (period === 'PM' && hour24 !== 12) hour24 += 12;
  const hourStr = hour24.toString().padStart(2, '0');
  
  const time = `${hourStr}:${minVal}`;

  // ── Read City ──
  const cityName = document.getElementById('city').value.trim();
  if (!cityName) {
    alert('Please enter your city of birth.');
    return;
  }

  // IST timezone
  const tz = 5.5;

  // Show Loading
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');

  try {
    // Geocode City Name via Nominatim
    const geocodeRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`
    );
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
    const ascendant = calculateAscendant(jd, lat, lng);

    // 3. Planets
    let planets = calculatePlanets(jd);

    // 4. Map to D1 Houses
    planets = mapToHouses(planets, ascendant.signIndex);

    // 5. Navamsha (D9) Chart
    const { d9Planets, d9AscendantSignIndex } = generateD9Chart(planets, ascendant.longitude);

    // 6. Vimshottari Dasha
    const birthDateObj = new Date(`${date}T${time}:00`);
    const dasha = calculateDasha(planets.MOON.longitude, birthDateObj);

    // Render UI
    renderRashiChart('d1-chart', planets, ascendant.signIndex);
    renderNavamshaChart('d9-chart', d9Planets, d9AscendantSignIndex);
    renderInterpretation('interpretation-section', planets, ascendant, dasha);
    renderPlanetTable('planet-table-section', planets, ascendant);
    renderDashaTimeline('dasha-balance', 'dasha-timeline', dasha);

    // Populate Dashboard Header
    const nameStr = document.getElementById('name').value.trim() || 'Anonymous';
    document.getElementById('user-details').innerHTML = `
      <div class="user-detail-item"><strong>Name:</strong> ${nameStr}</div>
      <div class="user-detail-item"><strong>Date:</strong> ${date}</div>
      <div class="user-detail-item"><strong>Time:</strong> ${time}</div>
      <div class="user-detail-item"><strong>Location:</strong> ${cityName} (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)</div>
    `;

    // Dashboard Transition
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('input-section').classList.add('hidden');
    document.querySelector('.hero').classList.add('hidden');
    
    document.getElementById('main-container').classList.add('dashboard-mode');
    
    document.getElementById('dashboard-header').classList.remove('hidden');
    document.getElementById('results').classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Calculation Error:', err);
    alert('Error calculating charts. Please check the console for details.');
    document.getElementById('loading').classList.add('hidden');
  }
};

// ── Back Button Handler ──
document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      document.getElementById('results').classList.add('hidden');
      document.getElementById('dashboard-header').classList.add('hidden');
      
      document.getElementById('main-container').classList.remove('dashboard-mode');
      
      document.querySelector('.hero').classList.remove('hidden');
      document.getElementById('input-section').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

