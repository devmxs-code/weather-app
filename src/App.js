import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { FiSearch, FiMapPin, FiDroplet, FiWind, FiSun, FiClock } from 'react-icons/fi';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'weather-icons-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 300;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1rem;
`;

const SearchForm = styled.form`
  display: flex;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1rem;
  outline: none;
  
  &::placeholder {
    color: #bdc3c7;
  }
`;

const SearchButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.3s ease;
  
  &:hover {
    background: #2980b9;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const WeatherCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-out;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 500;
  }
  
  svg {
    margin-right: 0.5rem;
    color: #e74c3c;
  }
`;

const CurrentWeather = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const WeatherIcon = styled.div`
  font-size: 4rem;
  margin-right: 2rem;
  display: flex;
  align-items: center;
`;

const Temperature = styled.div`
  font-size: 3.5rem;
  font-weight: 300;
  margin-right: 2rem;
  
  span {
    font-size: 2rem;
    vertical-align: super;
  }
`;

const WeatherDescription = styled.div`
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const DetailItem = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #3498db;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ForecastContainer = styled.div`
  margin-top: 2rem;
`;

const ForecastTitle = styled.h3`
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

const ForecastList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
`;

const ForecastItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  
  div:first-child {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  div:nth-child(2) {
    font-size: 1.5rem;
    margin: 0.5rem 0;
  }
`;

function App() {
  const [city, setCity] = useState('São Paulo');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter coordenadas da cidade
      const geoResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`
      );
      
      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error('Cidade não encontrada');
      }
      
      const { lat, lon } = geoResponse.data[0];
      
      // Buscar dados meteorológicos atuais e previsão
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=celsius&windspeed_unit=kmh`
      );
      
      // Processar dados atuais
      const currentData = weatherResponse.data.current_weather;
      const hourlyData = weatherResponse.data.hourly;
      
      setWeather({
        city,
        country: geoResponse.data[0].display_name.split(', ').pop(),
        current: {
          temperature: currentData.temperature,
          windspeed: currentData.windspeed,
          weathercode: currentData.weathercode,
          humidity: hourlyData.relativehumidity_2m[0],
          time: currentData.time
        }
      });
      
      // Processar previsão para os próximos dias
      const dailyData = weatherResponse.data.daily;
      const forecastData = [];
      
      for (let i = 0; i < Math.min(5, dailyData.time.length); i++) {
        forecastData.push({
          day: formatDay(dailyData.time[i]),
          weathercode: dailyData.weathercode[i],
          temp_max: dailyData.temperature_2m_max[i],
          temp_min: dailyData.temperature_2m_min[i]
        });
      }
      
      setForecast(forecastData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os dados. Verifique o nome da cidade.');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const formatDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  };

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

  const getWeatherIcon = (code) => {
    const size = 48;
    
    if (code === 0) return <WiDaySunny size={size} color="#F39C12" />;
    if (code <= 3) return <WiCloudy size={size} color="#BDC3C7" />;
    if (code <= 67) return <WiRain size={size} color="#3498DB" />;
    if (code <= 86) return <WiSnow size={size} color="#ECF0F1" />;
    if (code >= 95) return <WiThunderstorm size={size} color="#9B59B6" />;
    if (code <= 48) return <WiFog size={size} color="#95A5A6" />;
    
    return <WiDaySunny size={size} color="#F39C12" />;
  };

  return (
    <AppContainer>
      <Header>
        <Title>Previsão do Tempo</Title>
        <Subtitle>Obtenha informações meteorológicas em tempo real</Subtitle>
      </Header>

      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Digite o nome da cidade"
        />
        <SearchButton type="submit">
          <FiSearch /> Buscar
        </SearchButton>
      </SearchForm>

      {loading && <Loading>Carregando dados meteorológicos...</Loading>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {weather && (
        <WeatherCard>
          <Location>
            <FiMapPin />
            <h2>{weather.city}, {weather.country}</h2>
          </Location>

          <CurrentWeather>
            <WeatherIcon>
              {getWeatherIcon(weather.current.weathercode)}
            </WeatherIcon>
            <Temperature>
              {Math.round(weather.current.temperature)}<span>°C</span>
            </Temperature>
            <WeatherDescription>
              {getWeatherDescription(weather.current.weathercode)}
            </WeatherDescription>
          </CurrentWeather>

          <WeatherDetails>
            <DetailItem>
              <FiDroplet />
              <div>
                <div>Umidade</div>
                <div>{weather.current.humidity}%</div>
              </div>
            </DetailItem>
            <DetailItem>
              <FiWind />
              <div>
                <div>Vento</div>
                <div>{weather.current.windspeed} km/h</div>
              </div>
            </DetailItem>
            <DetailItem>
              <FiClock />
              <div>
                <div>Atualizado</div>
                <div>{lastUpdated && lastUpdated.toLocaleTimeString('pt-BR')}</div>
              </div>
            </DetailItem>
          </WeatherDetails>

          {forecast && (
            <ForecastContainer>
              <ForecastTitle>Previsão para os próximos dias</ForecastTitle>
              <ForecastList>
                {forecast.map((day, index) => (
                  <ForecastItem key={index}>
                    <div>{day.day}</div>
                    <div>{getWeatherIcon(day.weathercode)}</div>
                    <div>{Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°</div>
                  </ForecastItem>
                ))}
              </ForecastList>
            </ForecastContainer>
          )}
        </WeatherCard>
      )}
    </AppContainer>
  );
}

export default App;