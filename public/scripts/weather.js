/*************************
 *
 * WEATHER APP + LOCAL SERVER HOOKUP
 *
 *************************/

// get form
const weatherForm = document.forms['weather-form'];

// get data from form
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(weatherForm);
  const cityData = Object.fromEntries(formData);
  // console.log('searching for weather in ', cityData);

  const cityDataValue = Object.values(cityData);
  // console.log(cityDataValue[0]);

  fetchWeather(cityDataValue);
});

// send data from form to the server
async function fetchWeather(cityDataValue) {
  try {
    const response = await fetch('/api/v1/get-weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cityDataValue),
    });

    if (response.ok) {
      // pass weather we receive from the server to render function
      const weather = await response.json();
      // console.log('weather response is', weather);

      // Shape the data
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
      };

      // select the data
      const weatherData = {
        city: weather.city.name,
        code: weather.cod,
        date: new Date(weather.list[0].dt_txt).toLocaleDateString(
          undefined,
          options,
        ),
        weather: weather.list[0].weather[0].description,
        tempC: weather.list[0].main.temp,
        feelsLikeTempC: weather.list[0].main.feels_like,
        sunset: new Date(weather.city.sunset).toLocaleTimeString(
          [],
          optionsTime,
        ),
      };
      console.log('weatherData', weatherData);
      renderWeatherList(weatherData);
    } else {
      throw new Error(response);
    }
  } catch (err) {
    console.log('error', err.sendMessage || err.statusText);
  }
}

// render the data
export let mountNodeWeather = document.getElementById('target-weather');

// Data passed to this function inside the fetch call
export function renderWeatherList(weatherData) {
  // Todo build visual error feedback for user
  if (weatherData.code !== '200') {
    mountNodeWeather.innerHTML = 'City not found ... please search again';
  } else {
    const list = document.createElement('ul');
    // build the list
    const li = document.createElement('li');

    const { city, date, weather, tempC, feelsLikeTempC, sunset } = weatherData;

    li.innerHTML = `
      <div class="city-weather-wrapper">
        <h3 class="city-name">${city}</h3>
        <p class="city-date">${date}</p>
        <p class="city-weather">Outside it's <span class="weather-highlight"> ${weather}</span></p>
        <p class="city-temp">Current temperature <span class="weather-highlight">${tempC}C</span></p> 
        <p class="city-feels-like">It feels like <span class="weather-highlight">${feelsLikeTempC}C</span></p>
        <p class="city-sunset">Sunset at <span class="weather-highlight">${sunset}</span></p>
      </div>
      `;

    list.innerHTML = '';
    list.append(li);

    mountNodeWeather.innerHTML = '';
    mountNodeWeather.append(list);
  }
}
