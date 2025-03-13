export const geoApiOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": process.env.REACT_WEATHER_APP_GEODB - CITIES_API_KEY,
    "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
  },
};

export const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";

export const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/";

export const WEATHER_API_KEY =
  process.env.REACT_WEATHER_APP_OPEN - WEATHER_API_KEY;
