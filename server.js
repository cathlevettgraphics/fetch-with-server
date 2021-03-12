require('dotenv').config();
const express = require('express');
const axios = require('axios');

// TODO hook up previous project
// twitter keys
const {
  PORT = 3333,
  WEATHER_API_1,
  // CITY_SEARCH,
  WEATHER_API_2,
  WEATHER_API_KEY,
} = process.env;

// TODO defensive checks here

// make app
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const weatherAPICall = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&units=metric&appid=${WEATHER_API_KEY}`;

// get search term from form

app.post('/api/v1/get-weather', (req, res) => {
  console.log('searching for', req.body);
  const CITY_SEARCH = req.body;

  (async () => {
    // call api
    const response = await axios(
      `${WEATHER_API_1}${CITY_SEARCH}${WEATHER_API_2}${WEATHER_API_KEY}`,
    );
    // console.log(response.data);
    // TODO defensive checks here
    res.status(201).json(response.data);
  })();
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
