import axios from "axios";

const API_KEY = "465a931a26733989cdc8ca35d1e755e7"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Fetch weather using city name
export const fetchWeather = async (city: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric", // Use "imperial" for Fahrenheit
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

// Fetch weather using latitude and longitude (geolocation)
export const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data by coordinates:", error);
      throw error;
    }
  };