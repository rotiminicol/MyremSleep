// World postal code validation patterns
export const POSTAL_CODE_PATTERNS: Record<string, RegExp | null> = {
  // North America
  'United States': /^\d{5}(-\d{4})?$/,
  'Canada': /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
  
  // Europe
  'United Kingdom': /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/,
  'Germany': /^\d{5}$/,
  'France': /^\d{5}$/,
  'Italy': /^\d{5}$/,
  'Spain': /^\d{5}$/,
  'Netherlands': /^\d{4} [A-Za-z]{2}$/,
  'Belgium': /^\d{4}$/,
  'Switzerland': /^\d{4}$/,
  'Austria': /^\d{4}$/,
  'Sweden': /^\d{3} \d{2}$/,
  'Norway': /^\d{4}$/,
  'Denmark': /^\d{4}$/,
  'Finland': /^\d{5}$/,
  'Poland': /^\d{2}-\d{3}$/,
  'Czech Republic': /^\d{3} \d{2}$/,
  'Hungary': /^\d{4}$/,
  'Romania': /^\d{6}$/,
  'Bulgaria': /^\d{4}$/,
  'Greece': /^\d{5}$/,
  'Portugal': /^\d{4}-\d{3}$/,
  'Ireland': /^[A-Za-z]{3}[A-Za-z0-9 ]{4}$/,
  
  // Asia
  'Japan': /^\d{3}-\d{4}$/,
  'China': /^\d{6}$/,
  'South Korea': /^\d{5}$/,
  'India': /^\d{6}$/,
  'Singapore': /^\d{6}$/,
  'Malaysia': /^\d{5}$/,
  'Thailand': /^\d{5}$/,
  'Indonesia': /^\d{5}$/,
  'Philippines': /^\d{4}$/,
  'Vietnam': /^\d{6}$/,
  'Hong Kong': null, // No postal code system
  'Taiwan': /^\d{3}(\d{2})?$/,
  
  // Oceania
  'Australia': /^\d{4}$/,
  'New Zealand': /^\d{4}$/,
  
  // South America
  'Brazil': /^\d{5}-\d{3}$/,
  'Argentina': /^[A-Za-z]\d{4}[A-Za-z]{3}$/,
  'Chile': /^\d{7}$/,
  'Colombia': /^\d{6}$/,
  'Peru': /^\d{5}$/,
  'Venezuela': /^\d{4}$/,
  
  // Middle East
  'United Arab Emirates': null, // No postal code system
  'Saudi Arabia': /^\d{5}$/,
  'Israel': /^\d{7}$/,
  'Turkey': /^\d{5}$/,
  
  // Africa
  'South Africa': /^\d{4}$/,
  'Egypt': /^\d{5}$/,
  'Morocco': /^\d{5}$/,
  'Nigeria': /^\d{6}$/,
  'Kenya': /^\d{5}$/,
  
  // Default pattern for countries not specified
  'default': /^[A-Za-z0-9\s\-]{3,10}$/
};

// Get validation pattern for a country
export function getPostalCodePattern(country: string): RegExp | null {
  return POSTAL_CODE_PATTERNS[country] || POSTAL_CODE_PATTERNS['default'];
}

// Validate postal code for a specific country
export function validatePostalCode(postalCode: string, country: string): {
  isValid: boolean;
  error?: string;
  example?: string;
} {
  // If country has no postal code system
  if (POSTAL_CODE_PATTERNS[country] === null) {
    return { isValid: true }; // No validation needed
  }
  
  const pattern = getPostalCodePattern(country);
  if (!pattern) {
    return { isValid: true }; // No validation if no pattern found
  }
  
  const isValid = pattern.test(postalCode.trim());
  
  if (!isValid) {
    return {
      isValid: false,
      error: `Invalid postal code format for ${country}`,
      example: getExampleFormat(country)
    };
  }
  
  return { isValid: true };
}

// Get example format for a country
function getExampleFormat(country: string): string {
  const examples: Record<string, string> = {
    'United States': '12345 or 12345-6789',
    'Canada': 'A1A 1A1',
    'United Kingdom': 'SW1A 0AA',
    'Germany': '12345',
    'France': '75001',
    'Italy': '00100',
    'Spain': '28001',
    'Netherlands': '1234 AB',
    'Japan': '123-4567',
    'Australia': '2000',
    'Brazil': '12345-678',
    'China': '100000',
    'India': '110001',
    'Singapore': '238896',
  };
  
  return examples[country] || 'Check local format';
}

// Countries that don't use postal codes
export const NO_POSTAL_CODE_COUNTRIES = [
  'Hong Kong',
  'United Arab Emirates',
  'Panama',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Jordan',
  'Lebanon',
  'Angola',
  'Antigua and Barbuda',
  'Aruba',
  'Bahamas',
  'Barbados',
  'Belize',
  'Benin',
  'Botswana',
  'Burkina Faso',
  'Burundi',
  'Cameroon',
  'Central African Republic',
  'Chad',
  'Comoros',
  'Congo',
  'Congo, Democratic Republic of the',
  'Cote d\'Ivoire',
  'Djibouti',
  'Dominica',
  'Equatorial Guinea',
  'Eritrea',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Gabon',
  'Gambia',
  'Ghana',
  'Grenada',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Kiribati',
  'Lesotho',
  'Liberia',
  'Madagascar',
  'Malawi',
  'Maldives',
  'Mali',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Micronesia',
  'Mozambique',
  'Namibia',
  'Nauru',
  'Niger',
  'Palau',
  'Papua New Guinea',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'Sao Tome and Principe',
  'Senegal',
  'Seychelles',
  'Sierra Leone',
  'Solomon Islands',
  'Somalia',
  'Suriname',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tuvalu',
  'Uganda',
  'Vanuatu',
  'Yemen',
  'Zambia',
  'Zimbabwe'
];

// Check if a country uses postal codes
export function countryUsesPostalCode(country: string): boolean {
  return !NO_POSTAL_CODE_COUNTRIES.includes(country);
}
