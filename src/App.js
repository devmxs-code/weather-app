import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('São Paulo');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Primeiro, obtemos as coordenadas da cidade usando Nominatim
      const geoResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`
      );
      
      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error('Cidade não encontrada');
      }
      
      const { lat, lon } = geoResponse.data[0];
      
      // Depois, buscamos os dados meteorológicos usando Open-Meteo
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,windspeed_10m&temperature_unit=celsius&windspeed_unit=kmh`
      );
      
      setWeather({
        city,
        country: geoResponse.data[0].display_name.split(', ').pop(),
        current: {
          temperature: weatherResponse.data.current_weather.temperature,
          windspeed: weatherResponse.data.current_weather.windspeed,
          weathercode: weatherResponse.data.current_weather.weathercode,
          // Pegamos a umidade do primeiro horário disponível
          humidity: weatherResponse.data.hourly.relativehumidity_2m[0]
        }
      });
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os dados. Verifique o nome da cidade.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  // Função para converter weathercode em descrição e ícone
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Céu limpo',
      1: 'Principalmente limpo',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Nevoeiro',
      48: 'Nevoeiro com geada',
      51: 'Chuvisco leve',
      53: 'Chuvisco moderado',
      55: 'Chuvisco denso',
      56: 'Chuvisco congelante leve',
      57: 'Chuvisco congelante denso',
      61: 'Chuva leve',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      66: 'Chuva congelante leve',
      67: 'Chuva congelante forte',
      71: 'Queda de neve leve',
      73: 'Queda de neve moderada',
      75: 'Queda de neve forte',
      77: 'Grãos de neve',
      80: 'Pancadas de chuva leves',
      81: 'Pancadas de chuva moderadas',
      82: 'Pancadas de chuva violentas',
      85: 'Pancadas de neve leves',
      86: 'Pancadas de neve fortes',
      95: 'Trovoada leve ou moderada',
      96: 'Trovoada com granizo leve',
      99: 'Trovoada com granizo forte'
    };
    return weatherCodes[code] || 'Condição desconhecida';
  };

  // Função para obter íone baseado no weathercode
  const getWeatherIcon = (code) => {
    const iconMap = {
      0: '☀️',
      1: '🌤',
      2: '⛅',
      3: '☁️',
      45: '🌫',
      48: '🌫',
      51: '🌧',
      53: '🌧',
      55: '🌧',
      56: '🌧',
      57: '🌧',
      61: '🌧',
      63: '🌧',
      65: '🌧',
      66: '🌧',
      67: '🌧',
      71: '❄️',
      73: '❄️',
      75: '❄️',
      77: '❄️',
      80: '🌦',
      81: '🌦',
      82: '🌦',
      85: '🌨',
      86: '🌨',
      95: '⛈',
      96: '⛈',
      99: '⛈'
    };
    return iconMap[code] || '🌈';
  };

  return (
    <div className="App">
      <h1>Previsão do Tempo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Digite o nome da cidade"
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.city}, {weather.country}</h2>
          <div className="weather-info">
            <div className="weather-icon" style={{ fontSize: '3rem' }}>
              {getWeatherIcon(weather.current.weathercode)}
            </div>
            <p>{getWeatherDescription(weather.current.weathercode)}</p>
            <p>Temperatura: {weather.current.temperature}°C</p>
            <p>Umidade: {weather.current.humidity}%</p>
            <p>Vento: {weather.current.windspeed} km/h</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;