import React, { useState, useEffect } from "react";
import "./App.css";
import Search from "./components/Search";
import CurrentWeather from "./components/Current-weather";
import Forecast from "./components/Forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [fontColor, setFontColor] = useState("#ffffff"); // Default to white text
  const [iconColor, setIconColor] = useState("#ffffff"); // Default white

  const getBackgroundImage = () => {
    const defaultImages = [
      "default.jpg",
      "default_1.jpg",
      "default_2.jpg",
      "default_3.jpg",
      "default_4.jpg",
      "default_5.jpg",
      "default_6.jpg",
      "default_7.jpg",
    ];
    const getRandomImage = (images) =>
      images[Math.floor(Math.random() * images.length)];

    if (!currentWeather) return getRandomImage(defaultImages);

    const weatherMain = currentWeather.weather[0].main.toLowerCase();
    const weatherImages = {
      clear: ["clear.jpg", "clear_1.jpg", "clear_2.jpg"],
      sunny: ["sunny.jpg", "sunny_1.jpg"],
      clouds: ["clouds.jpg", "clouds_1.jpg", "clouds_2.jpg"],
      rain: ["rain.jpg", "rain_1.jpg", "rain_2.jpg"],
      drizzle: ["drizzle.jpg", "drizzle_1.jpg", "drizzle_2.jpg"],
      thunderstorm: ["thunderstorm.jpg", "thunderstorm_1.jpg"],
      snow: ["snow.jpg", "snow_1.jpg"],
      mist: ["mist.jpg", "mist_1.jpg"],
      fog: ["fog.jpg", "fog_1.jpg"],
    };

    return getRandomImage(weatherImages[weatherMain] || defaultImages);
  };

  useEffect(() => {
    const bgImage = new Image();
    bgImage.src = `/bg-images/${getBackgroundImage()}`;

    bgImage.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = bgImage.width;
      canvas.height = bgImage.height;
      ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      let brightness = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        brightness += (r + g + b) / 3; // Average brightness
      }
      brightness = brightness / (imageData.length / 4); // Normalize

      // Adjust font and icon color dynamically
      const newColor = brightness < 128 ? "#ffffff" : "#000000"; // Dark → white, Light → black
      setFontColor(newColor);
      setIconColor(newColor); // Set icon color too
    };
  }, [currentWeather]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--scrollbar-thumb",
      fontColor === "#ffffff"
        ? "rgba(255, 255, 255, 0.6)"
        : "rgba(0, 0, 0, 0.6)"
    );
    document.documentElement.style.setProperty(
      "--scrollbar-track",
      fontColor === "#ffffff"
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(255, 255, 255, 0.1)"
    );
  }, [fontColor]);

  function handleOnSearchChange(searchData) {
    const [lat, lon] = searchData.value.split(" ");
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    console.log("Current Weather:", currentWeather);
    console.log("Forecast:", forecast);
  }, [currentWeather, forecast]);

  return (
    <div
      className="bg-image-wrapper"
      style={{
        backgroundImage: `url(/bg-images/${getBackgroundImage()})`,
        color: fontColor,
      }}
    >
      <div>
        <div className="container">
          <header>
            <img
              src="./weather-header-icon.png"
              alt="weather header icon"
              style={{
                filter: iconColor === "#ffffff" ? "invert(1)" : "invert(0)",
              }}
            />
            <h1>Weather App</h1>
          </header>
          <Search onSearchChange={handleOnSearchChange} />
          {currentWeather && <CurrentWeather data={currentWeather} />}
          {forecast && <Forecast data={forecast} />}
        </div>
      </div>
    </div>
  );
}

export default App;
