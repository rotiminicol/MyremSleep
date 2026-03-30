export const COLOR_HEX: Record<string, { fill: string; shadow: string }> = {
  'Winter Cloud': { fill: '#F5F5F7', shadow: '#d0d0d4' },
  'Desert Whisperer': { fill: '#E5DACE', shadow: '#c0b8ac' },
  'Buttermilk': { fill: '#FFF4D2', shadow: '#e0d4a0' },
  'Clay Blush': { fill: '#D9A891', shadow: '#b07a63' },
  'Clayblush Pink': { fill: '#D9A891', shadow: '#b07a63' },
  'Pebble Haze': { fill: '#A3A3A3', shadow: '#787878' },
  'Desert Sand': { fill: '#E2CA9D', shadow: '#c0a870' },
  'Cinnamon Bark': { fill: '#8B6040', shadow: '#5a2c0a' },
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
