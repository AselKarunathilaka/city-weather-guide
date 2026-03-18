import {
  OPEN_METEO_GEOCODE,
  OPEN_METEO_WEATHER,
  OPEN_METEO_AIR,
  REST_COUNTRIES,
  WIKI_SUMMARY,
  WIKI_SEARCH
} from './config.js';

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getCoordinates(city) {
  const url = `${OPEN_METEO_GEOCODE}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const data = await fetchJson(url);

  if (!data.results || !data.results.length) {
    throw new Error('City not found.');
  }

  const result = data.results[0];

  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    countryCode: result.country_code,
    timezone: result.timezone,
    population: result.population || null
  };
}

export async function getWeather(lat, lon, timezone = 'auto') {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    timezone,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'is_day'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset'
    ].join(','),
    forecast_days: '5'
  });

  const url = `${OPEN_METEO_WEATHER}?${params.toString()}`;
  return fetchJson(url);
}

export async function getAirQuality(lat, lon, timezone = 'auto') {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    timezone,
    current: ['pm2_5', 'pm10', 'carbon_monoxide', 'nitrogen_dioxide', 'ozone', 'uv_index'].join(',')
  });

  const url = `${OPEN_METEO_AIR}?${params.toString()}`;
  return fetchJson(url);
}

export async function getCountryInfo(countryName) {
  const fields = [
    'name',
    'population',
    'currencies',
    'capital',
    'region',
    'subregion',
    'languages',
    'flags'
  ].join(',');

  const url = `${REST_COUNTRIES}/${encodeURIComponent(countryName)}?fields=${fields}`;
  const data = await fetchJson(url);

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return data[0];
}

export async function getCitySummary(city) {
  const url = `${WIKI_SUMMARY}/${encodeURIComponent(city)}`;

  try {
    const data = await fetchJson(url);
    return {
      title: data.title || city,
      extract: data.extract || '',
      description: data.description || '',
      contentUrls: data.content_urls || null
    };
  } catch {
    return {
      title: city,
      extract: '',
      description: '',
      contentUrls: null
    };
  }
}

export async function getWikiSearchTitles(city) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: city,
    format: 'json',
    origin: '*'
  });

  const url = `${WIKI_SEARCH}?${params.toString()}`;

  try {
    const data = await fetchJson(url);
    return data?.query?.search?.map((item) => item.title) || [];
  } catch {
    return [];
  }
}