// src/components/dashboard/CurrentTime.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Sun, Cloud, CloudRain, Wind, MapPin, Droplets } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const CurrentTime = () => {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: 48.8566, lon: 2.3522, city: 'Paris' });

  // OpenWeatherMap API Key (gratuite, 1000 appels/jour)
  const WEATHER_API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Obtenir la géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            city: 'Your Location'
          });
        },
        (error) => {
          console.log('Geolocation not available, using Paris');
        }
      );
    }
  }, []);

  // Récupérer la météo depuis OpenWeatherMap
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${WEATHER_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Weather API error');
        }

        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          city: data.name
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeather(null);
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [location]);

  const getWeatherDescription = () => {
    if (!weather) return t('weatherUnavailable');
    
    const desc = weather.description;
    
    const weatherTranslations = {
      en: {
        'clear sky': 'Clear Sky',
        'few clouds': 'Few Clouds',
        'scattered clouds': 'Scattered Clouds',
        'broken clouds': 'Broken Clouds',
        'overcast clouds': 'Overcast',
        'light rain': 'Light Rain',
        'moderate rain': 'Moderate Rain',
        'heavy rain': 'Heavy Rain',
        'snow': 'Snow',
        'mist': 'Mist',
        'fog': 'Fog'
      },
      fr: {
        'clear sky': 'Ciel Dégagé',
        'few clouds': 'Peu Nuageux',
        'scattered clouds': 'Nuages Épars',
        'broken clouds': 'Nuageux',
        'overcast clouds': 'Couvert',
        'light rain': 'Pluie Légère',
        'moderate rain': 'Pluie Modérée',
        'heavy rain': 'Forte Pluie',
        'snow': 'Neige',
        'mist': 'Brume',
        'fog': 'Brouillard'
      }
    };
    
    return weatherTranslations[language][desc] || desc;
  };

  const getWeatherIcon = () => {
    if (!weather) return <Sun className="w-10 h-10 text-amber-500" />;
    
    const iconCode = weather.icon;
    if (iconCode.includes('01')) return <Sun className="w-10 h-10 text-yellow-500" />;
    if (iconCode.includes('02')) return <Cloud className="w-10 h-10 text-gray-400" />;
    if (iconCode.includes('03') || iconCode.includes('04')) return <Cloud className="w-10 h-10 text-gray-500" />;
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="w-10 h-10 text-blue-500" />;
    if (iconCode.includes('13')) return <CloudRain className="w-10 h-10 text-blue-300" />;
    if (iconCode.includes('50')) return <Wind className="w-10 h-10 text-gray-400" />;
    return <Sun className="w-10 h-10 text-amber-500" />;
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center gap-2 text-amber-700 mb-4">
        <Clock className="w-5 h-5" />
        <span className="font-semibold">{t('currentTime')}</span>
      </div>

      <div className="text-5xl font-bold text-amber-900 mb-2">
        {currentTime.toLocaleTimeString(
          language === 'fr' ? 'fr-FR' : 'en-US', 
          { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: language === 'en'
          }
        )}
      </div>

      <div className="text-amber-700 mb-4">
        {currentTime.toLocaleDateString(
          language === 'fr' ? 'fr-FR' : 'en-US', 
          { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          }
        )}
      </div>

      {/* Weather Section */}
      <div className="border-t border-amber-200 pt-4 mt-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
            <span className="text-sm text-amber-600">{t('weatherUnavailable')}...</span>
          </div>
        ) : weather ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getWeatherIcon()}
                <div>
                  <div className="text-3xl font-bold text-amber-900">{weather.temp}°C</div>
                  <div className="text-sm text-amber-600 capitalize">{getWeatherDescription()}</div>
                  <div className="text-xs text-amber-500">{t('feelsLike')} {weather.feels_like}°C</div>
                </div>
              </div>
            </div>

            {/* Détails météo */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-white/50 rounded-lg p-2 flex items-center gap-2">
                <Wind className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-xs text-amber-600">{t('wind')}</div>
                  <div className="text-sm font-bold text-amber-900">{weather.wind} km/h</div>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-2 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-xs text-amber-600">{t('humidity')}</div>
                  <div className="text-sm font-bold text-amber-900">{weather.humidity}%</div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mt-3 text-xs text-amber-600">
              <MapPin className="w-3 h-3" />
              <span>{weather.city}</span>
            </div>

            {/* Powered by OpenWeatherMap */}
            <div className="mt-3 pt-3 border-t border-amber-200">
              <a 
                href="https://openweathermap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs text-amber-600 hover:text-amber-800 transition-colors"
              >
                <Cloud className="w-4 h-4" />
                <span>{t('weatherBy')}</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <Sun className="w-10 h-10 text-amber-500 opacity-50" />
            <span className="text-sm text-amber-600">{t('weatherUnavailable')}</span>
            <p className="text-xs text-amber-500 text-center">
              {t('enableLocation')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentTime;