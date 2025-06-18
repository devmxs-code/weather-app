import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes, ThemeProvider, createGlobalStyle } from 'styled-components';
import { 
  FiSearch, 
  FiMapPin, 
  FiDroplet, 
  FiWind, 
  FiSun, 
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiMoon,
  FiSun as FiSunIcon
} from 'react-icons/fi';
import { 
  WiDaySunny, 
  WiCloudy, 
  WiRain, 
  WiSnow, 
  WiThunderstorm, 
  WiFog,
  WiDayCloudy,
  WiNightClear,
  WiHumidity
} from 'weather-icons-react';
import './App.css'; // Importa o arquivo CSS

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Themes
const lightTheme = {
  colors: {
    primary: '#3498db',
    primaryDark: '#2980b9',
    danger: '#e74c3c',
    warning: '#f39c12',
    success: '#2ecc71',
    text: '#2c3e50',
    textLight: '#7f8c8d',
    background: '#f8f9fa',
    cardBg: '#ffffff',
  },
  breakpoints: {
    sm: '576px', // Adicionado breakpoint para telas pequenas
  },
};

const darkTheme = {
  colors: {
    primary: '#3498db',
    primaryDark: '#2980b9',
    danger: '#e74c3c',
    warning: '#f39c12',
    success: '#2ecc71',
    text: '#ecf0f1',
    textLight: '#bdc3c7',
    background: '#2c3e50',
    cardBg: '#34495e',
  },
  breakpoints: {
    sm: '576px', // Adicionado breakpoint para telas pequenas
  },
};

// Estilo global para aplicar o fundo ao body
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    background-color: ${(props) => props.theme.colors.background};
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
`;

// Styled Components
const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: ${(props) => props.theme.colors.text};
  background: ${(props) => props.theme.colors.background};
  min-height: 100vh;
  box-sizing: border-box;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.5rem;
  font-weight: 600;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.colors.textLight};
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.9rem;
  }
`;

const ThemeToggle = styled.button`
  background: ${(props) => props.theme.colors.cardBg};
  color: ${(props) => props.theme.colors.text};
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: white;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const SearchForm = styled.form`
  display: flex;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1rem;
  outline: none;
  background: ${(props) => props.theme.colors.cardBg};

  &::placeholder {
    color: #bdc3c7;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-bottom: 0.5rem;
  }
`;

const SearchButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primaryDark};
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }

  svg {
    margin-right: 0.5rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
    justify-content: center;
  }
`;

const WeatherCard = styled.div`
  background: ${(props) => props.theme.colors.cardBg};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-out;
  margin-bottom: 2rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1rem;
  }
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text};
  }
  
  svg {
    margin-right: 0.5rem;
    color: ${(props) => props.theme.colors.danger};
    min-width: 24px;
  }
`;

const CurrentWeather = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const WeatherIcon = styled.div`
  font-size: 4rem;
  margin-right: 2rem;
  display: flex;
  align-items: center;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const Temperature = styled.div`
  font-size: 3.5rem;
  font-weight: 300;
  margin-right: 2rem;

  span {
    font-size: 2rem;
    vertical-align: super;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-right: 0;
    margin-bottom: 1rem;
    font-size: 2.5rem;

    span {
      font-size: 1.5rem;
    }
  }
`;

const WeatherDescription = styled.div`
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.textLight};
  text-transform: capitalize;
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  background: ${(props) => props.theme.colors.background};
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: ${(props) => props.theme.colors.primary};
    min-width: 24px;
  }

  div {
    div:first-child {
      font-size: 0.9rem;
      color: ${(props) => props.theme.colors.textLight};
    }
    
    div:last-child {
      font-weight: 500;
      color: ${(props) => props.theme.colors.text};
    }
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.textLight};
  display: flex;
  flex-direction: column;
  align-items: center;
  
  svg {
    animation: ${rotate} 1s linear infinite;
    margin-bottom: 1rem;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ForecastContainer = styled.div`
  margin-top: 2rem;
`;

const ForecastTitle = styled.h3`
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ForecastList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
`;

const ForecastItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: ${(props) => props.theme.colors.background};
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  div:first-child {
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: ${(props) => props.theme.colors.text};
  }

  div:nth-child(2) {
    font-size: 1.5rem;
    margin: 0.5rem 0;
    display: flex;
    justify-content: center;
  }

  div:last-child {
    color: ${(props) => props.theme.colors.textLight};
    font-size: 0.9rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 0.5rem;
    div:nth-child(2) {
      font-size: 1.2rem;
    }
    div:last-child {
      font-size: 0.8rem;
    }
  }
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(52, 152, 219, 0.1);
  }
  
  svg {
    margin-right: 0.25rem;
  }
`;

const UnitToggle = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  
  button {
    background: ${(props) => props.theme.colors.background};
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:first-child {
      border-radius: 4px 0 0 4px;
    }
    
    &:last-child {
      border-radius: 0 4px 4px 0;
    }
    
    &.active {
      background: ${(props) => props.theme.colors.primary};
      color: white;
    }
  }
`;

function App() {
  const [city, setCity] = useState('São Paulo');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [searchHistory, setSearchHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // Estado para alternar entre temas

  const fetchWeather = React.useCallback(async () => {
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Obter coordenadas da cidade
      const geoResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`
      );

      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
      }

      const { lat, lon, display_name } = geoResponse.data[0];
      const country = display_name.split(', ').pop();

      // Buscar dados meteorológicos atuais e previsão
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m,precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm`
      );

      // Verificar se os dados retornados são válidos
      const currentData = weatherResponse.data.current_weather || {};
      const hourlyData = weatherResponse.data.hourly || {};
      const dailyData = weatherResponse.data.daily || {};

      setWeather({
        city,
        country,
        coords: { lat, lon },
        current: {
          temperature: currentData.temperature || 0,
          windspeed: currentData.windspeed || 0,
          weathercode: currentData.weathercode || 0,
          humidity: hourlyData.relativehumidity_2m?.[0] || 0,
          precipitation: hourlyData.precipitation?.[0] || 0,
          time: currentData.time || ''
        },
        today: {
          sunrise: dailyData.sunrise?.[0] || '',
          sunset: dailyData.sunset?.[0] || '',
          precipitation: dailyData.precipitation_sum?.[0] || 0
        }
      });

      // Processar previsão para os próximos dias
      const forecastData = (dailyData.time || []).map((date, i) => ({
        date,
        day: formatDay(date),
        weathercode: dailyData.weathercode?.[i] || 0,
        temp_max: dailyData.temperature_2m_max?.[i] || 0,
        temp_min: dailyData.temperature_2m_min?.[i] || 0,
        sunrise: dailyData.sunrise?.[i] || '',
        sunset: dailyData.sunset?.[i] || ''
      }));

      setForecast(forecastData.slice(0, 5));
      setLastUpdated(new Date());

      // Adicionar à lista de histórico (sem duplicatas)
      setSearchHistory((prev) => {
        const newItem = { city, country, timestamp: new Date() };
        const exists = prev.some((item) => item.city.toLowerCase() === city.toLowerCase());
        return exists ? prev : [newItem, ...prev].slice(0, 5);
      });
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os dados meteorológicos. Verifique sua conexão ou tente novamente mais tarde.');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    // Carregar dados iniciais
    fetchWeather();

    // Verificar se há geolocalização disponível
    if (navigator.geolocation && typeof localStorage !== 'undefined' && !localStorage.getItem('askedGeolocation')) {
      const askGeolocation = window.confirm('Deseja usar sua localização atual para ver a previsão do tempo?');
      if (askGeolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            ).then((response) => {
              const address = response.data.address || {};
              const cityName = address.city || address.town || address.village || address.county;
              if (cityName) {
                setCity(cityName);
              }
            }).catch((error) => {
              console.error('Erro ao obter localização:', error);
            });
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
          }
        );
      }
      localStorage.setItem('askedGeolocation', 'true');
    }
  }, [fetchWeather]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const formatDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'céu limpo',
      1: 'principalmente limpo',
      2: 'parcialmente nublado',
      3: 'nublado',
      45: 'nevoeiro',
      48: 'nevoeiro com geada',
      51: 'chuvisco leve',
      53: 'chuvisco moderado',
      55: 'chuvisco denso',
      56: 'chuvisco congelante leve',
      57: 'chuvisco congelante denso',
      61: 'chuva leve',
      63: 'chuva moderada',
      65: 'chuva forte',
      66: 'chuva congelante leve',
      67: 'chuvisco congelante forte',
      71: 'queda de neve leve',
      73: 'queda de neve moderada',
      75: 'queda de neve forte',
      77: 'grãos de neve',
      80: 'pancadas de chuva leves',
      81: 'pancadas de chuva moderadas',
      82: 'pancadas de chuva violentas',
      85: 'pancadas de neve leves',
      86: 'pancadas de neve fortes',
      95: 'trovoada leve ou moderada',
      96: 'trovoada com granizo leve',
      99: 'trovoada com granizo forte'
    };
    return weatherCodes[code] || 'condição desconhecida';
  };

  const getWeatherIcon = (code, isDay = true) => {
    const size = 48;
    
    if (code === 0) return isDay ? <WiDaySunny size={size} color="#F39C12" /> : <WiNightClear size={size} color="#2C3E50" />;
    if (code === 1) return isDay ? <WiDayCloudy size={size} color="#BDC3C7" /> : <WiNightClear size={size} color="#2C3E50" />;
    if (code <= 3) return <WiCloudy size={size} color="#BDC3C7" />;
    if (code <= 67) return <WiRain size={size} color="#3498DB" />;
    if (code <= 86) return <WiSnow size={size} color="#ECF0F1" />;
    if (code >= 95) return <WiThunderstorm size={size} color="#9B59B6" />;
    if (code <= 48) return <WiFog size={size} color="#95A5A6" />;
    
    return <WiDaySunny size={size} color="#F39C12" />;
  };

  const convertTemp = (temp) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  const handleRefresh = () => {
    fetchWeather();
  };

  const handleThemeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <>
        <GlobalStyle /> {/* Aplica o estilo global */}
        <AppContainer>
          <Header>
            <Title>Previsão do Tempo</Title>
            <Subtitle>Obtenha informações meteorológicas em tempo real para qualquer cidade do mundo</Subtitle>
          </Header>

          <ThemeToggle onClick={handleThemeToggle}>
            {darkMode ? <FiSunIcon size={20} /> : <FiMoon size={20} />}
            Alternar para {darkMode ? 'Modo Claro' : 'Modo Escuro'}
          </ThemeToggle>

          <UnitToggle>
            <button 
              className={unit === 'celsius' ? 'active' : ''} 
              onClick={() => setUnit('celsius')}
            >
              °C
            </button>
            <button 
              className={unit === 'fahrenheit' ? 'active' : ''} 
              onClick={() => setUnit('fahrenheit')}
            >
              °F
            </button>
          </UnitToggle>

          <SearchForm onSubmit={handleSubmit}>
            <SearchInput
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Digite o nome da cidade (ex: Rio de Janeiro, Nova York)"
            />
            <SearchButton type="submit" disabled={loading}>
              <FiSearch /> {loading ? 'Buscando...' : 'Buscar'}
            </SearchButton>
          </SearchForm>

          {loading && (
            <Loading>
              <FiRefreshCw size={24} />
              Carregando dados meteorológicos...
            </Loading>
          )}
          
          {error && (
            <ErrorMessage>
              <FiAlertCircle size={18} />
              {error}
            </ErrorMessage>
          )}

          {weather && (
            <>
              <WeatherCard>
                <Location>
                  <FiMapPin size={24} />
                  <h2>{weather.city}, {weather.country}</h2>
                </Location>

                <CurrentWeather>
                  <WeatherIcon>
                    {getWeatherIcon(weather.current.weathercode)}
                  </WeatherIcon>
                  <Temperature>
                    {convertTemp(weather.current.temperature)}<span>°{unit === 'celsius' ? 'C' : 'F'}</span>
                  </Temperature>
                  <WeatherDescription>
                    {getWeatherDescription(weather.current.weathercode)}
                  </WeatherDescription>
                </CurrentWeather>

                <WeatherDetails>
                  <DetailItem>
                    <FiDroplet size={20} />
                    <div>
                      <div>Umidade</div>
                      <div>{weather.current.humidity}%</div>
                    </div>
                  </DetailItem>
                  <DetailItem>
                    <FiWind size={20} />
                    <div>
                      <div>Vento</div>
                      <div>{weather.current.windspeed} km/h</div>
                    </div>
                  </DetailItem>
                  <DetailItem>
                    <WiHumidity size={20} />
                    <div>
                      <div>Precipitação</div>
                      <div>{weather.current.precipitation} mm</div>
                    </div>
                  </DetailItem>
                  <DetailItem>
                    <FiSun size={20} />
                    <div>
                      <div>Nascer do sol</div>
                      <div>{formatTime(weather.today.sunrise)}</div>
                    </div>
                  </DetailItem>
                  <DetailItem>
                    <FiSun size={20} style={{ transform: 'rotate(180deg)' }} />
                    <div>
                      <div>Pôr do sol</div>
                      <div>{formatTime(weather.today.sunset)}</div>
                    </div>
                  </DetailItem>
                  <DetailItem>
                    <FiClock size={20} />
                    <div>
                      <div>Atualizado</div>
                      <div>{lastUpdated && lastUpdated.toLocaleTimeString('pt-BR')}</div>
                    </div>
                  </DetailItem>
                </WeatherDetails>
              </WeatherCard>

              {forecast && (
                <ForecastContainer>
                  <ForecastTitle>
                    Previsão para os próximos dias
                    <RefreshButton onClick={handleRefresh}>
                      <FiRefreshCw size={16} />
                      Atualizar
                    </RefreshButton>
                  </ForecastTitle>
                  <ForecastList>
                    {forecast.map((day, index) => (
                      <ForecastItem key={index}>
                        <div>{day.day}</div>
                        <div>{getWeatherIcon(day.weathercode)}</div>
                        <div>
                          {convertTemp(day.temp_max)}° / {convertTemp(day.temp_min)}°
                        </div>
                        <div>
                          ☀️ {formatTime(day.sunrise)} / 🌙 {formatTime(day.sunset)}
                        </div>
                      </ForecastItem>
                    ))}
                  </ForecastList>
                </ForecastContainer>
              )}
            </>
          )}
        </AppContainer>
      </>
    </ThemeProvider>
  );
}

export default App;