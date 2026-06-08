import { ASCENDANT_MEANINGS, SUN_SIGN_MEANINGS, MOON_SIGN_MEANINGS, DASHA_MEANINGS, NAKSHATRA_MEANINGS } from '../astro/interpretation-data.js';
import { NAKSHATRAS } from '../astro/constants.js';

export function renderInterpretation(containerId, planets, ascendant, dasha) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const ascendantText = ASCENDANT_MEANINGS[ascendant.signIndex] || "Interpretation not available.";
  const sunText = SUN_SIGN_MEANINGS[planets.SUN.signIndex] || "Interpretation not available.";
  const westernSunText = SUN_SIGN_MEANINGS[planets.SUN.tropicalSignIndex] || "Interpretation not available.";
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
        <h4><span class="interp-icon">🌅</span> Ascendant (Lagna)
          <details class="info-popover">
            <summary title="What it represents">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </summary>
            <div class="popover-content">
              <p>The Ascendant is the zodiac sign that was rising on the eastern horizon when you were born. It represents your outward personality, physical appearance, and how you interact with the world.</p>
            </div>
          </details>
        </h4>
        <p><strong>${ascendant.signName}</strong> - ${ascendantText}</p>
      </div>
      <div class="interp-card">
        <h4><span class="interp-icon">🌍</span> Zodiac Sign (Western)
          <details class="info-popover">
            <summary title="What it represents">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </summary>
            <div class="popover-content">
              <p>This is your Sun sign in the Western (Tropical) astrological system. It is based on the Earth's seasons and dates rather than the physical background stars.</p>
            </div>
          </details>
        </h4>
        <p><strong>${planets.SUN.tropicalSignName}</strong> - ${westernSunText}</p>
      </div>
      <div class="interp-card">
        <h4><span class="interp-icon">☀️</span> Sun (Vedic)
          <details class="info-popover">
            <summary title="What it represents">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </summary>
            <div class="popover-content">
              <p>The Sun represents your ego, core identity, and soul purpose. It dictates where you seek to shine, your natural authority, and your vitality.</p>
            </div>
          </details>
        </h4>
        <p><strong>${planets.SUN.signName}</strong> - ${sunText}</p>
      </div>
      <div class="interp-card">
        <h4><span class="interp-icon">🌙</span> Moon (Chandra)
          <details class="info-popover">
            <summary title="What it represents">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </summary>
            <div class="popover-content">
              <p>The Moon represents your mind, emotions, and how you process the world internally. It dictates your emotional needs, intuition, and your deepest psychological nature.</p>
            </div>
          </details>
        </h4>
        <p><strong>${planets.MOON.signName}</strong> - ${moonText}</p>
      </div>
      <div class="interp-card">
        <h4><span class="interp-icon">✨</span> Moon's Nakshatra
          <details class="info-popover">
            <summary title="What it represents">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </summary>
            <div class="popover-content">
              <p>Nakshatras are the 27 lunar mansions. The Nakshatra your Moon was in at birth provides extremely specific insights into your mind's true nature and triggers your Dasha timeline.</p>
            </div>
          </details>
        </h4>
        <p><strong>${NAKSHATRAS[planets.MOON.nakshatraIndex]}</strong> - ${nakshatraText}</p>
      </div>
      <div class="interp-card" style="grid-column: 1 / -1;">
        <h4><span class="interp-icon">⏳</span> Current Phase (Mahadasha)
          <details class="info-popover">
            <summary title="What it represents">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </summary>
            <div class="popover-content">
              <p>Vimshottari Dasha is a timeline of planetary periods. The active Mahadasha (major period) determines the overarching themes, focus, and energy of this phase of your life.</p>
            </div>
          </details>
        </h4>
        <p><strong>Active Lord: ${currentDashaLord}</strong></p>
        <p>${dashaText}</p>
      </div>
    </div>
  `;
}
