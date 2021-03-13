require('dotenv').config();
const express = require('express');
const axios = require('axios');

// weather, news and food keys
const {
  PORT = 3333,
  WEATHER_API_1,
  WEATHER_API_2,
  WEATHER_API_KEY,
  FOOD_API_KEY,
} = process.env;

// WEATHER CALL – `https://api.openweathermap.org/data/2.5/forecast?q=${CITY+SEARCH}&units=metric&appid=${WEATHER_API_KEY}`;
if (!WEATHER_API_1) throw new Error('bad request address');
if (!WEATHER_API_2) throw new Error('bad request address');
if (!WEATHER_API_KEY) throw new Error('no api key provided');

// FOOD CALL – `https://www.themealdb.com/api/json/v1/${FOOD_API_KEY}/search.php?s=${FOOD_SEARCH}`;
if (!FOOD_API_KEY) throw new Error('no api key provided');

// make app
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WEATHER APP
// get search term from form
app.post('/api/v1/get-weather', (req, res) => {
  console.log('searching for', req.body);
  const CITY_SEARCH = req.body;
  (async () => {
    try {
      // call api
      const response = await axios(
        `${WEATHER_API_1}${CITY_SEARCH}${WEATHER_API_2}${WEATHER_API_KEY}`,
      );
      // console.log(response.data);
      res.status(201).json(response.data);
    } catch (err) {
      console.log('err', err);
      return res.status(500).send(err);
    }
  })();
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
