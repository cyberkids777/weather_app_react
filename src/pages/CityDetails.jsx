import { useParams, Link } from 'react-router-dom';
import { citiesData } from '../data/mockData';
import { useSelector } from 'react-redux';
import { ArrowLeft, Wind, CloudRain, Cloud } from 'lucide-react';

// 1. IMPORTUJEMY NASZ KOMPONENT
import { WeatherIcon } from '../components/WeatherIcon';

const CityDetails = () => {
    const { id } = useParams();
    const unit = useSelector((state) => state.settings.unit);
    const city = citiesData.find(c => c.id === parseInt(id));

    if (!city) return <div className="text-center mt-10 text-xl">Nie znaleziono miasta.</div>;

    const convert = (t) => {
        if (unit === 'F') return Math.round(t * 1.8 + 32);
        if (unit === 'K') return Math.round(t + 273.15);
        return t;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                to="/"
                className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Wróć do listy
            </Link>

            {/* Główna karta pogodowa */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                {/* Nagłówek z nazwą miasta */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{city.name}</h1>
                    <p className="opacity-90 text-lg capitalize">{city.condition}</p>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Temperatura + DUŻA IKONA */}
                    <div className="flex items-center justify-center md:justify-start">
                        {/* 2. UŻYCIE IKONY DLA AKTUALNEJ POGODY */}
                        <WeatherIcon
                            condition={city.condition}
                            className="w-24 h-24 mr-6 drop-shadow-md"
                        />

                        <span className="text-6xl font-bold text-slate-800 tracking-tight">
                            {convert(city.temp)}°{unit}
                        </span>
                    </div>

                    {/* Szczegóły Grid (Wiatr, Deszcz, Chmury) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center text-slate-500 mb-1">
                                <Wind size={18} className="mr-2" /> Wiatr
                            </div>
                            <p className="font-semibold text-slate-800">{city.windSpeed} km/h</p>
                            <p className="text-xs text-slate-400">{city.windDir}</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center text-slate-500 mb-1">
                                <CloudRain size={18} className="mr-2" /> Opady
                            </div>
                            <p className="font-semibold text-slate-800">{city.precipAmount} mm</p>
                            <p className="text-xs text-slate-400">{city.precipProb}% szans</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl col-span-2 border border-slate-100">
                            <div className="flex items-center text-slate-500 mb-1">
                                <Cloud size={18} className="mr-2" /> Zachmurzenie
                            </div>
                            <p className="font-semibold text-slate-800">{city.clouds}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sekcja Prognozy */}
            <h3 className="text-xl font-bold text-slate-800 mb-4">Prognoza na 5 dni</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {city.forecast?.map((day, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-200"
                    >
                        <span className="text-slate-500 font-medium mb-3">{day.day}</span>

                        {/* 3. UŻYCIE IKONY W PROGNOZIE */}
                        <WeatherIcon
                            condition={day.condition}
                            className="w-10 h-10 mb-2"
                        />

                        <span className="text-2xl font-bold text-slate-800 mb-1">
                            {convert(day.temp)}°
                        </span>
                        <span className="text-xs text-slate-400 capitalize">{day.condition}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CityDetails;