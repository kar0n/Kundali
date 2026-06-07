export function renderPlanetTable(containerId, planets, ascendant) {
  const tbody = document.querySelector(`#${containerId} tbody`);
  if (!tbody) return;
  
  let html = `
    <tr style="background: rgba(0,0,0,0.05);">
      <td><strong>Ascendant</strong></td>
      <td>${ascendant.signName}</td>
      <td>${formatDegree(ascendant.degreeInSign)}</td>
      <td>-</td>
      <td>-</td>
    </tr>
  `;
  
  for (const key in planets) {
    const p = planets[key];
    const retroStr = p.isRetrograde ? ' (R)' : '';
    html += `
      <tr>
        <td style="color: ${p.color}; font-weight: 600;">${p.name}${retroStr}</td>
        <td>${p.signName}</td>
        <td>${formatDegree(p.degreeInSign)}</td>
        <td>${p.nakshatraName}</td>
        <td>${p.pada}</td>
      </tr>
    `;
  }
  
  tbody.innerHTML = html;
}

function formatDegree(decimalDeg) {
  const deg = Math.floor(decimalDeg);
  const min = Math.floor((decimalDeg - deg) * 60);
  const sec = Math.floor(((decimalDeg - deg) * 60 - min) * 60);
  return `${deg}° ${min}' ${sec}"`;
}
