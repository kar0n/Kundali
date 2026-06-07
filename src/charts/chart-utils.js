export const HOUSE_CENTERS = [
  { x: 200, y: 100 }, // H1
  { x: 100, y: 50 },  // H2
  { x: 50, y: 100 },  // H3
  { x: 100, y: 200 }, // H4
  { x: 50, y: 300 },  // H5
  { x: 100, y: 350 }, // H6
  { x: 200, y: 300 }, // H7
  { x: 300, y: 350 }, // H8
  { x: 350, y: 300 }, // H9
  { x: 300, y: 200 }, // H10
  { x: 350, y: 100 }, // H11
  { x: 300, y: 50 }   // H12
];

export const SIGN_CENTERS = [
  { x: 200, y: 150 }, // H1
  { x: 150, y: 50 },  // H2
  { x: 50, y: 150 },  // H3
  { x: 150, y: 200 }, // H4
  { x: 50, y: 250 },  // H5
  { x: 150, y: 350 }, // H6
  { x: 200, y: 250 }, // H7
  { x: 250, y: 350 }, // H8
  { x: 350, y: 250 }, // H9
  { x: 250, y: 200 }, // H10
  { x: 350, y: 150 }, // H11
  { x: 250, y: 50 }   // H12
];

export function generateChartSVG(planetsData, ascendantSignIndex, chartType = 'D1') {
  let svg = `
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <style>
        .line { stroke: rgba(30, 58, 138, 0.4); stroke-width: 2; fill: none; }
        .text { fill: rgba(31, 41, 55, 0.9); font-family: 'Outfit', sans-serif; font-size: 14px; text-anchor: middle; font-weight: 600; }
        .sign-num { fill: rgba(31, 41, 55, 0.4); font-size: 12px; }
        .vargottama { fill: #c2410c; font-size: 16px; }
      </style>
      
      <!-- Box and Diagonals -->
      <rect x="0" y="0" width="400" height="400" class="line" fill="#ffffff"/>
      <line x1="0" y1="0" x2="400" y2="400" class="line"/>
      <line x1="400" y1="0" x2="0" y2="400" class="line"/>
      <line x1="200" y1="0" x2="400" y2="200" class="line"/>
      <line x1="400" y1="200" x2="200" y2="400" class="line"/>
      <line x1="200" y1="400" x2="0" y2="200" class="line"/>
      <line x1="0" y1="200" x2="200" y2="0" class="line"/>
  `;

  // Draw Sign Numbers
  for (let i = 0; i < 12; i++) {
    // Determine sign number for this house
    let signNum = (ascendantSignIndex + i) % 12 + 1;
    let pos = SIGN_CENTERS[i];
    svg += `<text x="${pos.x}" y="${pos.y}" class="text sign-num">${signNum}</text>`;
  }

  // Draw Planets
  const houseOccupants = Array.from({ length: 12 }, () => []);
  
  for (const key in planetsData) {
    const p = planetsData[key];
    const houseIndex = (p.house || p.d9House) - 1;
    if (houseIndex >= 0 && houseIndex < 12) {
      houseOccupants[houseIndex].push(p);
    }
  }

  for (let i = 0; i < 12; i++) {
    const occupants = houseOccupants[i];
    if (occupants.length > 0) {
      const pos = HOUSE_CENTERS[i];
      const spacing = 16;
      let startY = pos.y - ((occupants.length - 1) * spacing) / 2;
      
      occupants.forEach((p, idx) => {
        const retroStr = p.isRetrograde ? '(R)' : '';
        const vargStr = chartType === 'D9' && p.isVargottama ? '★' : '';
        const textLabel = `${p.abbr}${retroStr} ${vargStr}`;
        svg += `<text x="${pos.x}" y="${startY + (idx * spacing)}" class="text" fill="${p.color || '#fff'}">${textLabel}</text>`;
      });
    }
  }

  svg += `</svg>`;
  return svg;
}
