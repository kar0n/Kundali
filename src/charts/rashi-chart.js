import { generateChartSVG } from './chart-utils.js';

export function renderRashiChart(containerId, planets, ascendantSignIndex) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = generateChartSVG(planets, ascendantSignIndex, 'D1');
}
