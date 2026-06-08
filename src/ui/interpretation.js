import { ASCENDANT_MEANINGS, SUN_SIGN_MEANINGS, MOON_SIGN_MEANINGS, DASHA_MEANINGS, NAKSHATRA_MEANINGS } from '../astro/interpretation-data.js';
import { NAKSHATRAS } from '../astro/constants.js';

export function renderInterpretation(containerId, planets, ascendant, dasha) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const ascendantText = ASCENDANT_MEANINGS[ascendant.signIndex] || "Interpretation not available.";
  const sunText = SUN_SIGN_MEANINGS[planets.SUN.signIndex] || "Interpretation not available.";
  const moonText = MOON_SIGN_MEANINGS[planets.MOON.signIndex] || "Interpretation not available.";
  const nakshatraText = NAKSHATRA_MEANINGS[planets.MOON.nakshatraIndex] || "Interpretation not available.";
  
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
        <details class="interp-guide interp-guide-small">
          <summary><strong>What it represents</strong></summary>
          <div class="guide-content">
            <p style="margin:0;font-size:0.9rem;color:var(--text-medium)">The Ascendant is the zodiac sign that was rising on the eastern horizon when you were born. It represents your outward personality, physical appearance, and how you interact with the world.</p>
          </div>
        </details>
        <p>${ascendantText}</p>
      </div>
      <div class="interp-card">
        <h4><span class="interp-icon">☀️</span> Sun (Surya)</h4>
        <details class="interp-guide interp-guide-small">
          <summary><strong>What it represents</strong></summary>
          <div class="guide-content">
            <p style="margin:0;font-size:0.9rem;color:var(--text-medium)">The Sun represents your ego, core identity, and soul purpose. It dictates where you seek to shine, your natural authority, and your vitality.</p>
          </div>
        </details>
        <p>${sunText}</p>
      </div>
      <div class="interp-card">
        <h4><span class="interp-icon">🌙</span> Moon (Chandra)</h4>
        <details class="interp-guide interp-guide-small">
          <summary><strong>What it represents</strong></summary>
          <div class="guide-content">
            <p style="margin:0;font-size:0.9rem;color:var(--text-medium)">The Moon represents your mind, emotions, and how you process the world internally. It dictates your emotional needs, intuition, and your deepest psychological nature.</p>
          </div>
        </details>
        <p>${moonText}</p>
      </div>
      <div class="interp-card">
        <h4><span class="interp-icon">✨</span> Moon's Nakshatra</h4>
        <details class="interp-guide interp-guide-small">
          <summary><strong>What it represents</strong></summary>
          <div class="guide-content">
            <p style="margin:0;font-size:0.9rem;color:var(--text-medium)">Nakshatras are the 27 lunar mansions. The Nakshatra your Moon was in at birth provides extremely specific insights into your mind's true nature and triggers your Dasha timeline.</p>
          </div>
        </details>
        <p><strong>${NAKSHATRAS[planets.MOON.nakshatraIndex]}</strong> - ${nakshatraText}</p>
      </div>
      <div class="interp-card" style="grid-column: 1 / -1;">
        <h4><span class="interp-icon">⏳</span> Current Phase (Mahadasha)</h4>
        <details class="interp-guide interp-guide-small">
          <summary><strong>What it represents</strong></summary>
          <div class="guide-content">
            <p style="margin:0;font-size:0.9rem;color:var(--text-medium)">Vimshottari Dasha is a timeline of planetary periods. The active Mahadasha (major period) determines the overarching themes, focus, and energy of this phase of your life.</p>
          </div>
        </details>
        <p><strong>Active Lord: ${currentDashaLord}</strong></p>
        <p>${dashaText}</p>
      </div>
    </div>
  `;
}
