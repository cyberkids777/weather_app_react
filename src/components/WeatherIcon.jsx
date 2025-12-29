import {
    Cloud,
    CloudRain,
    CloudLightning,
    CloudSnow,
    Sun,
    Moon,
    CloudDrizzle,
    CloudFog,
    Wind
} from 'lucide-react';

export const WeatherIcon = ({ condition, className = "w-12 h-12" }) => {
    // Normalizacja tekstu, aby uniknąć błędów wielkości liter
    const status = condition ? condition.toLowerCase() : '';

    switch (status) {
        case 'clear':
            return <Sun className={`text-yellow-500 ${className}`} />;

        case 'clouds':
        case 'cloudy':
            return <Cloud className={`text-gray-400 ${className}`} />;

        case 'rain':
            return <CloudRain className={`text-blue-400 ${className}`} />;

        case 'drizzle':
            return <CloudDrizzle className={`text-blue-300 ${className}`} />;

        case 'thunderstorm':
            return <CloudLightning className={`text-purple-500 ${className}`} />;

        case 'snow':
            return <CloudSnow className={`text-white ${className}`} />;

        case 'mist':
        case 'fog':
        case 'smoke':
            return <CloudFog className={`text-gray-300 ${className}`} />;

        case 'wind':
            return <Wind className={`text-gray-500 ${className}`} />;

        // Domyślna ikona, jeśli stan nie jest rozpoznany
        default:
            return <Sun className={`text-yellow-500 ${className}`} />;
    }
};