export function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';
  return new Intl.NumberFormat().format(value);
}

export function formatTemp(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';
  return `${Math.round(value)}°C`;
}

export function formatSpeed(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';
  return `${Math.round(value)} km/h`;
}

export function weatherCodeToText(code) {
  const map = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };

  return map[code] || 'Unknown weather';
}

export function getAqiCategory(pm25) {
  if (pm25 === null || pm25 === undefined || Number.isNaN(pm25)) {
    return { label: 'Unavailable', className: 'moderate' };
  }

  if (pm25 <= 12) return { label: 'Good', className: 'good' };
  if (pm25 <= 35.4) return { label: 'Moderate', className: 'moderate' };
  return { label: 'Poor', className: 'poor' };
}

export function chunkTextToBullets(text, fallback = []) {
  if (!text || typeof text !== 'string') return fallback;

  const sentences = text
    .split('.')
    .map((s) => s.trim())
    .filter(Boolean);

  return sentences.slice(0, 5);
}