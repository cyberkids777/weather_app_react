import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL;
const GEO_URL = import.meta.env.VITE_GEO_URL;

// 1. Najpierw zdobywamy Lat/Lon na podstawie nazwy miasta
const getCoordinates = async (city) => {
    const response = await axios.get(`${GEO_URL}/direct?q=${city}&limit=1&appid=${API_KEY}`);
    if (!response.data || response.data.length === 0) {
        throw new Error('Nie znaleziono miasta');
    }
    return {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        name: response.data[0].name // Oficjalna nazwa z API
    };
};

// 2. Pobieramy pogodę znając już współrzędne
export const getWeatherData = async (cityName) => {
    try {
        // KROK A: GEOCODING
        const { lat, lon, name } = await getCoordinates(cityName);

        // KROK B: POGODA (Tutaj używamy standardowego API 2.5, bo jest bezpieczniejsze dla darmowych kont)
        // Jeśli masz OneCall 3.0, endpoint wyglądałby tak:
        // https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${API_KEY}

        const [weatherRes, forecastRes] = await Promise.all([
            axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        ]);

        const current = weatherRes.data;
        const forecastList = forecastRes.data.list;

        // Przetwarzanie prognozy (wyciągamy 1 wpis na dzień, np. z południa)
        const dailyForecast = [];
        const seenDays = new Set();

        forecastList.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const day = date.getDate();

            // Bierzemy prognozę z godziny 12:00 lub pierwszą dostępną dla nowego dnia
            if (!seenDays.has(day) && item.dt_txt.includes("12:00:00")) {
                seenDays.add(day);
                dailyForecast.push({
                    day: date.toLocaleDateString('pl-PL', { weekday: 'short' }),
                    temp: Math.round(item.main.temp),
                    condition: item.weather[0].main
                });
            }
        });

        // Formatujemy dane do widoku
        return {
            id: current.id, // OWM ID
            name: name, // Używamy nazwy z Geocodingu (jest ładniejsza)
            lat: lat,
            lon: lon,
            temp: Math.round(current.main.temp),
            condition: current.weather[0].main,
            description: current.weather[0].description,
            windSpeed: Math.round(current.wind.speed * 3.6),
            windDir: "N/A", // Uproszczenie
            precipAmount: current.rain ? current.rain['1h'] || 0 : 0,
            clouds: current.clouds.all,
            forecast: dailyForecast.slice(0, 5) // 5 dni
        };

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};