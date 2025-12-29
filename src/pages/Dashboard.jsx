import { useState } from 'react';
import { Link } from 'react-router-dom';
import { citiesData } from '../data/mockData';
import { useSelector } from 'react-redux';

// 1. IMPORTUJEMY KOMPONENT IKONY
import { WeatherIcon } from '../components/WeatherIcon';

const convertTemp = (temp, unit) => {
    if (unit === 'F') return Math.round(temp * 1.8 + 32);
    if (unit === 'K') return Math.round(temp + 273.15);
    return temp;
};

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const unit = useSelector((state) => state.settings.unit);

    const filteredCities = citiesData.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Sekcja wyszukiwania */}
            <div className="mb-8 max-w-md mx-auto sm:mx-0">
                <input
                    type="text"
                    placeholder="Szukaj miasta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Responsywna siatka (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCities.map((city) => (
                    <div
                        key={city.id}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col justify-between"
                    >
                        <div>
                            {/* ZMODYFIKOWANA SEKCJA NAGŁÓWKA KARTY */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{city.name}</h3>
                                    {/* Tekstowy opis pogody pod nazwą miasta */}
                                    <span className="text-slate-500 text-sm font-medium">
                                        {city.condition}
                                    </span>
                                </div>

                                {/* 2. UŻYCIE IKONY (zamiast starego badge'a) */}
                                <WeatherIcon
                                    condition={city.condition}
                                    className="w-10 h-10 drop-shadow-sm"
                                />
                            </div>

                            <div className="text-4xl font-bold text-slate-900 mb-2">
                                {convertTemp(city.temp, unit)}°{unit}
                            </div>
                        </div>

                        <Link to={`/city/${city.id}`} className="mt-4 block">
                            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                Szczegóły
                            </button>
                        </Link>
                    </div>
                ))}
            </div>

            {filteredCities.length === 0 && (
                <p className="text-center text-slate-500 mt-10">Nie znaleziono miast pasujących do wyszukiwania.</p>
            )}
        </div>
    );
};

export default Dashboard;