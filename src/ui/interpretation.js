import { ASCENDANT_MEANINGS, SUN_SIGN_MEANINGS, MOON_SIGN_MEANINGS, DASHA_MEANINGS } from '../astro/interpretation-data.js';

export function renderInterpretation(containerId, planets, ascendant, dasha) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const ascendantText = ASCENDANT_MEANINGS[ascendant.signIndex] || "Interpretation not available.";
  const sunText = SUN_SIGN_MEANINGS[planets.SUN.signIndex] || "Interpretation not available.";
  const moonText = MOON_SIGN_MEANINGS[planets.MOON.signIndex] || "Interpretation not available.";
  
  // Find the currently active dasha lord
  // If the chart was just calculated, dasha.startingLord is the current lord at birth.
  // Wait, the user wants the interpretation of the *current* Dasha.
  // Since the user didn't enter a current date, we'll interpret the current Dasha based on today's date!
  
  const now = new Date();
  let currentDashaLord = dasha.startingLord;
  for (const period of dasha.timeline) {
    if (now >= period.startDate && now < period.endDate) {
      currentDashaLord = period.lord;
      break;
    }
  }

  const dashaText = DASHA_MEANINGS[currentDashaLord] || "Interpretation not available.";

  container.innerHTML = `
    <h3>Astrological Reading</h3>
    <div class="interpretation-grid">
      <div class="interp-card">
        <h4><span class="interp-icon">🌅</span> Ascendant (Lagna)</h4>
        <p>${ascendantText}</p>
      </div>
      <div class="interp-card">
        <h4><span class="interp-icon">☀️</span> Sun (Surya)</h4>
        <p>${sunText}</p>
      </div>
      <div class="interp-card">
        <h4><span class="interp-icon">🌙</span> Moon (Chandra)</h4>
        <p>${moonText}</p>
      </div>
      <div class="interp-card">
        <h4><span class="interp-icon">⏳</span> Current Phase (Mahadasha)</h4>
        <p><strong>Active Lord: ${currentDashaLord}</strong></p>
        <p>${dashaText}</p>
      </div>
    </div>
  `;
}
