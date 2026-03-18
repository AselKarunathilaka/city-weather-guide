import { DEFAULT_CITY, FEATURED_CITIES } from './config.js';
import { TOURIST_FALLBACKS } from './data.js';
import {
  getCoordinates,
  getWeather,
  getAirQuality,
  getCountryInfo,
  getCitySummary,
  getWikiSearchTitles
} from './api.js';
import {
  renderCurrentWeather,
  renderAirQuality,
  renderSnapshot,
  renderForecast,
  renderCityIntro,
  renderTouristLocations,
  renderHistoricalRelevance,
  setHero,
  setStatus
} from './ui.js';

const featuredCitiesContainer = document.getElementById('featuredCities');
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const cityLocalTime = document.getElementById('cityLocalTime');
const cityTimezone = document.getElementById('cityTimezone');

let clockInterval = null;
let activeTimezone = null;

function populateFeaturedCities() {
  featuredCitiesContainer.innerHTML = FEATURED_CITIES
    .map(
      (city) => `
        <button class="city-chip" data-city="${city}" type="button">
          ${city}
        </button>
      `
    )
    .join('');
}

function setActiveCityChip(city) {
  const chips = document.querySelectorAll('.city-chip');
  chips.forEach((chip) => {
    const isMatch = chip.dataset.city.toLowerCase() === city.toLowerCase();
    chip.classList.toggle('active', isMatch);
  });
}

function updateClock() {
  if (!activeTimezone) {
    cityLocalTime.textContent = '--:--:--';
    cityTimezone.textContent = '--';
    return;
  }

  const now = new Date();

  cityLocalTime.textContent = new Intl.DateTimeFormat('en-GB', {
    timeZone: activeTimezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now);

  cityTimezone.textContent = activeTimezone;
}

function startCityClock(timezone) {
  activeTimezone = timezone || null;

  if (clockInterval) {
    clearInterval(clockInterval);
  }

  updateClock();

  if (activeTimezone) {
    clockInterval = setInterval(updateClock, 1000);
  }
}

async function buildTouristList(city, wikiTitles) {
  const fallback = TOURIST_FALLBACKS[city] || [];
  const related = wikiTitles
    .filter((title) => title.toLowerCase() !== city.toLowerCase())
    .slice(0, 5);

  const merged = [...new Set([...fallback, ...related])];
  return merged.slice(0, 6);
}

async function loadCity(city) {
  try {
    setStatus(`Loading data for ${city}...`);

    const cityInfo = await getCoordinates(city);
    const [weather, air, countryInfo, summary, wikiTitles] = await Promise.all([
      getWeather(cityInfo.latitude, cityInfo.longitude, cityInfo.timezone || 'auto'),
      getAirQuality(cityInfo.latitude, cityInfo.longitude, cityInfo.timezone || 'auto'),
      getCountryInfo(cityInfo.country),
      getCitySummary(cityInfo.name),
      getWikiSearchTitles(cityInfo.name)
    ]);

    const touristList = await buildTouristList(cityInfo.name, wikiTitles);

    setHero(cityInfo.name, cityInfo.country);
    startCityClock(cityInfo.timezone);
    renderCurrentWeather(cityInfo.name, weather);
    renderAirQuality(air);
    renderSnapshot(cityInfo, countryInfo);
    renderForecast(weather);
    renderCityIntro(summary);
    renderTouristLocations(cityInfo.name, touristList);
    renderHistoricalRelevance(summary.extract);

    setActiveCityChip(cityInfo.name);
    setStatus(`Showing data for ${cityInfo.name}, ${cityInfo.country}.`);
  } catch (error) {
    console.error(error);
    setStatus(error.message || 'Something went wrong while loading data.', true);
  }
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    setStatus('Please enter a city name.', true);
    return;
  }

  await loadCity(city);
});

featuredCitiesContainer.addEventListener('click', async (event) => {
  const button = event.target.closest('.city-chip');
  if (!button) return;

  const selectedCity = button.dataset.city;
  cityInput.value = selectedCity;
  setActiveCityChip(selectedCity);
  await loadCity(selectedCity);
});

populateFeaturedCities();
cityInput.value = DEFAULT_CITY;
loadCity(DEFAULT_CITY);