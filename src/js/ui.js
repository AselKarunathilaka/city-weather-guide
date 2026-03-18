import {
  formatNumber,
  formatTemp,
  formatSpeed,
  weatherCodeToText,
  getAqiCategory,
  chunkTextToBullets,
  escapeHtml
} from './helpers.js';

export function setStatus(message = '', isError = false) {
  const status = document.getElementById('statusMessage');

  if (!message) {
    status.classList.add('hidden');
    status.textContent = '';
    return;
  }

  status.classList.remove('hidden');
  status.textContent = message;
  status.style.borderColor = isError ? 'rgba(239,68,68,0.45)' : 'rgba(96,165,250,0.3)';
  status.style.background = isError ? 'rgba(239,68,68,0.12)' : 'rgba(96,165,250,0.12)';
}

export function renderCurrentWeather(cityName, weather) {
  const target = document.getElementById('currentWeather');
  const current = weather?.current;
  const daily = weather?.daily;

  if (!current) {
    target.innerHTML = '<p class="content-placeholder">Weather data unavailable.</p>';
    return;
  }

  target.innerHTML = `
    <div class="kpi">
      <small class="muted">${escapeHtml(cityName)}</small>
      <strong>${formatTemp(current.temperature_2m)}</strong>
      <span>${escapeHtml(weatherCodeToText(current.weather_code))}</span>
      <span>Feels like: ${formatTemp(current.apparent_temperature)}</span>
      <span>Humidity: ${current.relative_humidity_2m ?? 'N/A'}%</span>
      <span>Wind: ${formatSpeed(current.wind_speed_10m)}</span>
      <span>Sunrise: ${daily?.sunrise?.[0]?.split('T')[1] || 'N/A'}</span>
      <span>Sunset: ${daily?.sunset?.[0]?.split('T')[1] || 'N/A'}</span>
    </div>
  `;
}

export function renderAirQuality(air) {
  const target = document.getElementById('airQuality');
  const current = air?.current;

  if (!current) {
    target.innerHTML = '<p class="content-placeholder">Air quality data unavailable.</p>';
    return;
  }

  const category = getAqiCategory(current.pm2_5);

  target.innerHTML = `
    <div class="badge ${category.className}">${category.label}</div>
    <div class="kpi">
      <strong>${current.pm2_5 ?? 'N/A'}</strong>
      <span>PM2.5 µg/m³</span>
      <span>PM10: ${current.pm10 ?? 'N/A'} µg/m³</span>
      <span>CO: ${current.carbon_monoxide ?? 'N/A'} µg/m³</span>
      <span>NO₂: ${current.nitrogen_dioxide ?? 'N/A'} µg/m³</span>
      <span>O₃: ${current.ozone ?? 'N/A'} µg/m³</span>
      <span>UV Index: ${current.uv_index ?? 'N/A'}</span>
    </div>
  `;
}

export function renderSnapshot(cityInfo, countryInfo) {
  const target = document.getElementById('citySnapshot');

  const currencyNames = countryInfo?.currencies
    ? Object.values(countryInfo.currencies).map((c) => `${c.name} (${c.symbol || '-'})`).join(', ')
    : 'N/A';

  const languages = countryInfo?.languages
    ? Object.values(countryInfo.languages).join(', ')
    : 'N/A';

  target.innerHTML = `
    <ul class="meta-list">
      <li><strong>City:</strong> ${escapeHtml(cityInfo.name || 'N/A')}</li>
      <li><strong>Country:</strong> ${escapeHtml(cityInfo.country || 'N/A')}</li>
      <li><strong>Population:</strong> ${formatNumber(cityInfo.population || countryInfo?.population)}</li>
      <li><strong>Currency:</strong> ${escapeHtml(currencyNames)}</li>
      <li><strong>Region:</strong> ${escapeHtml(countryInfo?.region || 'N/A')}</li>
      <li><strong>Subregion:</strong> ${escapeHtml(countryInfo?.subregion || 'N/A')}</li>
      <li><strong>Capital:</strong> ${escapeHtml(countryInfo?.capital?.[0] || 'N/A')}</li>
      <li><strong>Languages:</strong> ${escapeHtml(languages)}</li>
      <li><strong>Timezone:</strong> ${escapeHtml(cityInfo.timezone || 'N/A')}</li>
    </ul>
  `;
}

export function renderForecast(weather) {
  const target = document.getElementById('forecastGrid');
  const daily = weather?.daily;

  if (!daily?.time?.length) {
    target.innerHTML = '<div class="content-placeholder">Forecast unavailable.</div>';
    return;
  }

  target.innerHTML = daily.time
    .map((date, index) => {
      const readableDate = new Date(date).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      return `
        <div class="forecast-day">
          <strong>${readableDate}</strong>
          <p>${weatherCodeToText(daily.weather_code[index])}</p>
          <p>Max: ${formatTemp(daily.temperature_2m_max[index])}</p>
          <p>Min: ${formatTemp(daily.temperature_2m_min[index])}</p>
        </div>
      `;
    })
    .join('');
}

export function renderCityIntro(summary) {
  const target = document.getElementById('cityIntro');

  if (!summary?.extract) {
    target.innerHTML = '<p class="content-placeholder">No city introduction found.</p>';
    return;
  }

  target.innerHTML = `
    <p>${escapeHtml(summary.extract)}</p>
    ${
      summary?.contentUrls?.desktop?.page
        ? `<p><a class="city-link" href="${summary.contentUrls.desktop.page}" target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a></p>`
        : ''
    }
  `;
}

export function renderTouristLocations(city, touristList) {
  const target = document.getElementById('touristLocations');

  if (!touristList?.length) {
    target.innerHTML = '<p class="content-placeholder">No tourist locations found.</p>';
    return;
  }

  target.innerHTML = `
    <ul class="tourist-list">
      ${touristList.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
    </ul>
    <p class="content-placeholder">Popular places associated with ${escapeHtml(city)}.</p>
  `;
}

export function renderHistoricalRelevance(summaryText = '') {
  const target = document.getElementById('historicalRelevance');
  const items = chunkTextToBullets(summaryText, ['Historical context not available.']);

  target.innerHTML = `
    <ul class="tourist-list">
      ${items.map((item) => `<li>${escapeHtml(item)}.</li>`).join('')}
    </ul>
  `;
}

export function setHero(cityName, countryName = '') {
  document.getElementById('heroTitle').textContent = `${cityName}${countryName ? `, ${countryName}` : ''}`;
  document.getElementById('heroSubtitle').textContent =
    'Current weather, air quality, country information, tourism highlights, and a short background overview.';
}