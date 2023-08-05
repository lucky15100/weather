const API_KEY = 'e4eb424f6c093197e3cf61bab9ea4961';
const weatherCardsContainer = document.getElementById('weatherCards');
const cityInput = document.getElementById('cityInput');
const addButton = document.getElementById('addButton');
const cities = new Set();

addButton.addEventListener('click', () => {
  const cityName = cityInput.value.trim();

  if (cityName === '') {
    alert('Please enter a city name.');
    return;
  }

  if (cities.has(cityName)) {
    alert('City already added.');
    return;
  }

  fetchWeatherData(cityName);
});

function fetchWeatherData(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.cod === '404') {
        alert('City not found. Please enter a valid city name.');
        return;
      }

      cities.add(cityName);
      updateWeatherCards();
    })
    .catch(error => {
      alert('Error fetching weather data. Please try again.');
      console.error(error);
    });
}

function updateWeatherCards() {
  weatherCardsContainer.innerHTML = '';
  cities.forEach(city => {
    fetchWeatherDataForCity(city);
  });
}

function fetchWeatherDataForCity(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const weatherCard = createWeatherCard(cityName, data);
      if (cities.has(cityName)) {
        weatherCard.classList.add('added');
      }
      weatherCardsContainer.appendChild(weatherCard);
    })
    .catch(error => {
      console.error(error);
    });
}

function createWeatherCard(city, data) {
  const weatherCard = document.createElement('div');
  weatherCard.classList.add('weather-card');

  const weatherIcon = document.createElement('img');
  weatherIcon.src = getWeatherIconUrl(data.weather[0].icon);
  weatherCard.appendChild(weatherIcon);

  const cityName = document.createElement('h2');
  cityName.textContent = city;
  weatherCard.appendChild(cityName);

  const weatherInfo = document.createElement('div');
  weatherInfo.innerHTML = `
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Pressure: ${data.main.pressure} hPa</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;

  weatherCard.appendChild(weatherInfo);
  return weatherCard;
}

function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/w/${iconCode}.png`;
}
