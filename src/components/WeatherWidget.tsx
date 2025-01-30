import { useState, useEffect } from "react";
import { fetchWeatherByCoords } from "../services/weatherService";
import { Container, Typography, CircularProgress, Paper } from "@mui/material";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      getWeatherByLocation(latitude, longitude);
    });
  }, []);

  const getWeatherByLocation = async (lat: number, lon: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      setWeather(data);
    } catch (err: any) {
      setError(`Geolocation Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 5, textAlign: "center" }}
      >
        <Typography variant="h5">Weather</Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {weather && (
          <div>
            <Typography variant="h6">
              {weather.name}, {weather.sys.country}
            </Typography>
            <Typography variant="h4">
              {Math.round(weather?.main?.temp)}°C
            </Typography>
            <Typography variant="subtitle1">
              {weather.weather[0].description}
            </Typography>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt="Weather Icon"
            />
          </div>
        )}
      </Paper>
    </Container>
  );
}
