import { DASHA_MEANINGS } from '../astro/interpretation-data.js';

export function renderDashaTimeline(balanceElementId, timelineElementId, dashaData) {
  const balanceEl = document.getElementById(balanceElementId);
  const timelineEl = document.getElementById(timelineElementId);
  
  if (!balanceEl || !timelineEl) return;
  
  const bYears = Math.floor(dashaData.balanceYears);
  const bMonths = Math.floor((dashaData.balanceYears - bYears) * 12);
  balanceEl.innerHTML = `Balance of Dasha at birth: <strong>${dashaData.startingLord}</strong> for ${bYears} years and ${bMonths} months.`;
  
  let html = '<div class="dasha-list">';
  
  dashaData.timeline.forEach(maha => {
    html += `
      <details class="dasha-maha">
        <summary>
          <span class="dasha-lord">${maha.lord}</span>
          <span class="dasha-dates">${formatDate(maha.startDate)} – ${formatDate(maha.endDate)}</span>
        </summary>
        <div class="dasha-antardashas">
          <p class="dasha-interp"><em>${DASHA_MEANINGS[maha.lord] || ''}</em></p>
          ${maha.antardashas.map(antar => `
            <div class="dasha-antar">
              <span class="dasha-lord">${maha.lord} / ${antar.lord}</span>
              <span class="dasha-dates">${formatDate(antar.startDate)} – ${formatDate(antar.endDate)}</span>
            </div>
          `).join('')}
        </div>
      </details>
    `;
  });
  
  html += '</div>';
  timelineEl.innerHTML = html;
}

function formatDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
