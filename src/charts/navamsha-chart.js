import { generateChartSVG } from './chart-utils.js';

export function renderNavamshaChart(containerId, d9Planets, d9AscendantSignIndex) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = generateChartSVG(d9Planets, d9AscendantSignIndex, 'D9');
}
