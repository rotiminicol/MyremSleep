export const COLOR_HEX: Record<string, { fill: string; shadow: string }> = {
  'Winter Cloud': { fill: '#FFFFFF', shadow: '#e0e0e0' },
  'Desert Whisperer': { fill: '#E6C9A8', shadow: '#d0b090' },
  'Buttermilk': { fill: '#FBF3DB', shadow: '#e0d0b0' },
  'Clay Blush': { fill: '#AF8C82', shadow: '#906050' },
  'Clayblush Pink': { fill: '#AF8C82', shadow: '#906050' },
  'Pebble Haze': { fill: '#9D9D9D', shadow: '#787878' },
  'Desert Sand': { fill: '#C3874D', shadow: '#a06030' },
  'Cinnamon Bark': { fill: '#875C32', shadow: '#603020' },
};

/**
 * Extracts a known color name from a product title or handle.
 * Returns null if no known color is found.
 */
export function extractColorFromTitle(title: string, handle: string = ''): string | null {
  const combined = (title + ' ' + handle.replace(/-/g, ' ')).toLowerCase();

  if (combined.includes('desert whisperer')) return 'Desert Whisperer';
  if (combined.includes('buttermilk')) return 'Buttermilk';
  if (combined.includes('clay blush') || combined.includes('clayblush')) return 'Clay Blush';
  if (combined.includes('pebble haze')) return 'Pebble Haze';
  if (combined.includes('cinnamon bark')) return 'Cinnamon Bark';
  if (combined.includes('desert sand')) return 'Desert Sand';
  if (combined.includes('winter cloud')) return 'Winter Cloud';

  // Handle generalized titles like "Sateen Bedding Set" or "Sateen"
  if (
    title.toLowerCase().includes('sateen bedding set') || 
    handle.includes('sateen-bedding-set') ||
    title.toLowerCase() === 'sateen'
  ) {
    return 'Winter Cloud';
  }

  return null;
}
