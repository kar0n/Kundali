export function calculateNavamsha(longitude) {
  const rashiIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  
  // Navamsha division is 3°20' = 10/3 degrees
  const navamshaDiv = Math.floor(degInSign / (10 / 3)); // 0-8
  
  // Starting sign depends on the Rashi type (Cardinal=0, Fixed=8, Dual=4 offsets)
  const offsets = [0, 8, 4, 0, 8, 4, 0, 8, 4, 0, 8, 4];
  const startSign = (rashiIndex + offsets[rashiIndex]) % 12;
  
  const d9SignIndex = (startSign + navamshaDiv) % 12;
  const isVargottama = d9SignIndex === rashiIndex;
  
  return { d9SignIndex, isVargottama };
}

export function generateD9Chart(planets, ascendantLong) {
  const d9Planets = {};
  
  // Calculate D9 Ascendant
  const ascD9 = calculateNavamsha(ascendantLong);
  
  for (const key in planets) {
    const p = planets[key];
    const { d9SignIndex, isVargottama } = calculateNavamsha(p.longitude);
    
    // Map to D9 House (relative to D9 Ascendant)
    let d9House = (d9SignIndex - ascD9.d9SignIndex + 12) % 12 + 1;
    
    d9Planets[key] = {
      ...p,
      d9SignIndex,
      d9House,
      isVargottama
    };
  }
  
  return { d9Planets, d9AscendantSignIndex: ascD9.d9SignIndex };
}
