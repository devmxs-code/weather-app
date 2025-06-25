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
  FiSun as FiSunIcon,
  FiChevronDown,
  FiChevronUp
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
  WiHumidity,
  WiStrongWind
} from 'weather-icons-react';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Themes
const lightTheme = {
  colors: {
    primary: '#4361ee',
    primaryDark: '#3a0ca3',
    secondary: '#4cc9f0',
    danger: '#f72585',
    warning: '#f8961e',
    success: '#4ad66d',
    text: '#2b2d42',
    textLight: '#8d99ae',
    background: '#f5f5f5', // Fundo mais claro
    cardBg: '#ffffff',
    cardShadow: 'rgba(149, 157, 165, 0.2)',
    border: '#e0e0e0', // Nova cor para bordas
    gradient: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)'
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px'
  },
};

const darkTheme = {
  colors: {
    primary: '#4895ef',
    primaryDark: '#3a0ca3',
    secondary: '#4cc9f0',
    danger: '#f72585',
    warning: '#f8961e',
    success: '#4ad66d',
    text: '#ffffff', // Branco para maior contraste
    textLight: '#d1d1d1', // Tom mais claro para texto secundário
    background: '#1a1a2e',
    cardBg: '#16213e',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    border: '#2a2a3b', // Cor escura para bordas no modo escuro
    gradient: 'linear-gradient(135deg, #4895ef 0%, #4cc9f0 100%)' // Gradiente mais claro
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px'
  },
};

// Estilo global
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    width: 100vw;
    background-color: ${(props) => props.theme.colors.background};
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    box-sizing: border-box;
    color: ${(props) => props.theme.colors.text};
    transition: all 0.3s ease;
    line-height: 1.6;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    html {
      font-size: 14px;
    }
  }
`;

// Styled Components
const AppContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    padding: 1.5rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 10;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  background: ${(props) => props.theme.colors.gradient};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${(props) => props.theme.colors.primary};
    border-radius: 3px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.colors.textLight};
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  font-weight: 300;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.9rem;
  }
`;

const ThemeToggle = styled.button`
  background: ${(props) => props.theme.colors.cardBg};
  color: ${(props) => props.theme.colors.text};
  border: none;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  border-radius: 50px;
  display: flex;
  align-items: center;
  margin: 0 auto 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px ${(props) => props.theme.colors.cardShadow};
  font-weight: 500;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.colors.gradient};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px ${(props) => props.theme.colors.cardShadow};

    &::before {
      opacity: 1;
    }
  }

  svg {
    margin-right: 0.5rem;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(15deg);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
`;

const WeatherCard = styled.div`
  background: ${(props) => props.theme.colors.cardBg};
  border-radius: 6px;
  padding: 2rem;
  box-shadow: 0 15px 30px ${(props) => props.theme.colors.cardShadow};
  border: 1px solid ${(props) => props.theme.colors.border}; /* Moldura */
  animation: ${fadeIn} 0.5s ease-out;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px ${(props) => props.theme.colors.cardShadow};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: ${(props) => props.theme.colors.gradient};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 1.5rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.25rem;
    border-radius: 4px;
  }
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 50px;
      height: 3px;
      background: ${(props) => props.theme.colors.gradient};
      border-radius: 3px;
    }
  }
  
  svg {
    margin-right: 0.75rem;
    color: ${(props) => props.theme.colors.primary};
    min-width: 24px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    h2 {
      font-size: 1.5rem;
    }
  }
`;

const CurrentWeather = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }
`;

const WeatherIcon = styled.div`
  font-size: 5rem;
  margin-right: 2rem;
  display: flex;
  align-items: center;
  animation: ${pulse} 2s infinite ease-in-out;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-right: 0;
    margin-bottom: 1rem;
    font-size: 4rem;
  }
`;

const Temperature = styled.div`
  font-size: 4rem;
  font-weight: 300;
  margin-right: 2rem;
  position: relative;
  display: inline-block;
  background: ${(props) => props.theme.colors.gradient};
  -webkit-background-clip: text;
  background-clip: text;
  color: ${(props) => props.theme.colors.text}; /* Alterado para usar a cor do texto */
  
  span {
    font-size: 2rem;
    vertical-align: super;
    position: absolute;
    top: 0.5rem;
    right: -1.5rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 3rem;
    margin-right: 0;
    margin-bottom: 1rem;

    span {
      font-size: 1.5rem;
      top: 0.3rem;
      right: -1rem;
    }
  }
`;

const WeatherDescription = styled.div`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.textLight};
  text-transform: capitalize;
  font-weight: 400;
  padding: 0.5rem 1rem;
  background: rgba(67, 97, 238, 0.1);
  border-radius: 50px;
  margin-top: 0.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1rem;
  }
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
`;

const DetailItem = styled.div`
  background: ${(props) => props.theme.colors.background};
  padding: 1.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px ${(props) => props.theme.colors.cardShadow};
  border: 1px solid ${(props) => props.theme.colors.border}; /* Moldura */

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px ${(props) => props.theme.colors.cardShadow};
  }

  svg {
    margin-right: 1rem;
    color: ${(props) => props.theme.colors.primary};
    min-width: 24px;
    font-size: 1.5rem;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  div {
    div:first-child {
      font-size: 0.9rem;
      color: ${(props) => props.theme.colors.textLight};
      margin-bottom: 0.25rem;
      font-weight: 400;
    }
    
    div:last-child {
      font-weight: 600;
      color: ${(props) => props.theme.colors.text};
      font-size: 1.1rem;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1rem;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.textLight};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  
  svg {
    animation: ${rotate} 1s linear infinite;
    margin-bottom: 1.5rem;
    color: ${(props) => props.theme.colors.primary};
    font-size: 2rem;
  }

  p {
    margin-top: 1rem;
    font-weight: 300;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(247, 37, 133, 0.1);
  color: ${(props) => props.theme.colors.danger};
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  border-left: 4px solid ${(props) => props.theme.colors.danger};
  animation: ${slideIn} 0.3s ease-out;
  
  svg {
    margin-right: 1rem;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    font-weight: 500;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1rem;
    font-size: 0.9rem;
  }
`;

const ForecastContainer = styled.div`
  margin-top: 0;
`;

const ForecastTitle = styled.h3`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 50px;
    height: 3px;
    background: ${(props) => props.theme.colors.gradient};
    border-radius: 3px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1.25rem;
  }
`;

const ForecastList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
  }
`;

const ForecastItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: ${(props) => props.theme.colors.cardBg};
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: default;
  box-shadow: 0 5px 15px ${(props) => props.theme.colors.cardShadow};
  border: 1px solid ${(props) => props.theme.colors.border}; /* Moldura */
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${(props) => props.theme.colors.gradient};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px ${(props) => props.theme.colors.cardShadow};
  }

  div:first-child {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${(props) => props.theme.colors.text};
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  div:nth-child(2) {
    font-size: 0.9rem;
    color: ${(props) => props.theme.colors.textLight};
    margin-bottom: 0.5rem;
  }

  div:nth-child(3) {
    font-size: 2rem;
    margin: 1rem 0;
    display: flex;
    justify-content: center;
    color: ${(props) => props.theme.colors.primary};
  }

  div:last-child {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 1rem;
    margin-top: 0.5rem;
    background: rgba(67, 97, 238, 0.1);
    padding: 0.5rem;
    border-radius: 50px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1rem;

    div:first-child {
      font-size: 0.9rem;
    }

    div:nth-child(3) {
      font-size: 1.5rem;
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
  padding: 0.5rem 1rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  font-weight: 500;
  background: rgba(67, 97, 238, 0.1);
  
  &:hover {
    background: rgba(67, 97, 238, 0.2);
    transform: translateY(-1px);
  }
  
  svg {
    margin-right: 0.5rem;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(180deg);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const UnitToggle = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
  
  button {
    background: ${(props) => props.theme.colors.cardBg};
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    color: ${(props) => props.theme.colors.textLight};
    box-shadow: 0 2px 5px ${(props) => props.theme.colors.cardShadow};
    
    &:first-child {
      border-radius: 50px 0 0 50px;
    }
    
    &:last-child {
      border-radius: 0 50px 50px 0;
    }
    
    &.active {
      background: ${(props) => props.theme.colors.primary};
      color: white;
      box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3);
    }

    &:hover:not(.active) {
      background: ${(props) => props.theme.colors.background};
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-bottom: 1rem;
    
    button {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }
  }
`;

const HistoryContainer = styled.div`
  margin-top: 2rem;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${(props) => props.theme.colors.cardBg};
  border-radius: 6px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px ${(props) => props.theme.colors.cardShadow};
  border: 1px solid ${(props) => props.theme.colors.border}; /* Moldura */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${(props) => props.theme.colors.cardShadow};
    background: ${(props) => props.theme.colors.primary};
    color: white;

    div {
      color: white;
    }
  }

  div:first-child {
    font-weight: 500;
  }

  div:last-child {
    color: ${(props) => props.theme.colors.textLight};
    font-size: 0.8rem;
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  font-weight: 500;
  margin-left: auto;
  margin-right: auto;
  background: rgba(67, 97, 238, 0.1);

  &:hover {
    background: rgba(67, 97, 238, 0.2);
  }

  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateY(2px);
  }
`;

const SearchForm = styled.form`
  display: flex;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.border}; /* Moldura */
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 5px 15px ${(props) => props.theme.colors.cardShadow};
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1.5px solid ${(props) => props.theme.colors.primary};
  border-radius: 6px 0 0 6px;
  font-size: 1rem;
  outline: none;
  color: ${(props) => props.theme.colors.text};
  background: ${(props) => props.theme.colors.cardBg};
  transition: all 0.3s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primaryDark};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}22;
  }
`;

const SearchButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 0 6px 6px 0;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primaryDark};
  }

  &:disabled {
    background: ${(props) => props.theme.colors.textLight};
    cursor: not-allowed;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const WeatherContainer = styled.div`
  margin-top: 2rem;
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
  const [darkMode, setDarkMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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
        formattedDate: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
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
            console.error('Erro ao obter geolocalização:', error.message);
            setError('Não foi possível acessar sua localização. Por favor, insira a cidade manualmente.');
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
    
    if (code === 0) return isDay ? <WiDaySunny size={size} /> : <WiNightClear size={size} />;
    if (code === 1) return isDay ? <WiDayCloudy size={size} /> : <WiNightClear size={size} />;
    if (code <= 3) return <WiCloudy size={size} />;
    if (code <= 67) return <WiRain size={size} />;
    if (code <= 86) return <WiSnow size={size} />;
    if (code >= 95) return <WiThunderstorm size={size} />;
    if (code <= 48) return <WiFog size={size} />;
    
    return <WiDaySunny size={size} />;
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

  const handleHistoryClick = (cityName) => {
    setCity(cityName);
    setShowHistory(false);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <>
        <GlobalStyle />
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
              <p>Carregando dados meteorológicos...</p>
            </Loading>
          )}
          
          {error && (
            <ErrorMessage>
              <FiAlertCircle size={18} />
              <p>{error}</p>
            </ErrorMessage>
          )}

          {weather && (
            <>
              <WeatherContainer>
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
                      <WiStrongWind size={20} />
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
                  <WeatherCard>
                    <ForecastTitle>
                      Previsão para 5 dias
                      <RefreshButton onClick={handleRefresh}>
                        <FiRefreshCw size={16} />
                        Atualizar
                      </RefreshButton>
                    </ForecastTitle>
                    <ForecastList>
                      {forecast.map((day, index) => (
                        <ForecastItem key={index}>
                          <div>{day.day}</div>
                          <div>{day.formattedDate}</div> {/* Exibe a data formatada */}
                          <div>{getWeatherIcon(day.weathercode)}</div>
                          <div>
                            {convertTemp(day.temp_max)}° / {convertTemp(day.temp_min)}°
                          </div>
                        </ForecastItem>
                      ))}
                    </ForecastList>
                  </WeatherCard>
                )}
              </WeatherContainer>

              {searchHistory.length > 0 && (
                <HistoryContainer>
                  <ForecastTitle>
                    Histórico de Buscas
                    <ExpandButton onClick={() => setShowHistory(!showHistory)}>
                      {showHistory ? 'Mostrar menos' : 'Mostrar mais'}
                      {showHistory ? <FiChevronUp /> : <FiChevronDown />}
                    </ExpandButton>
                  </ForecastTitle>
                  {(showHistory ? searchHistory : searchHistory.slice(0, 3)).map((item, index) => (
                    <HistoryItem key={index} onClick={() => handleHistoryClick(item.city)}>
                      <div>{item.city}, {item.country}</div>
                      <div>{new Date(item.timestamp).toLocaleString('pt-BR')}</div>
                    </HistoryItem>
                  ))}
                </HistoryContainer>
              )}
            </>
          )}
        </AppContainer>
      </>
    </ThemeProvider>
  );
}

export default App;