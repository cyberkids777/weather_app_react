import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { WeatherIcon } from '../components/WeatherIcon';
import { getWeatherData } from '../api/weather'; // <--- Import nowej funkcji

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const unit = useSelector((state) => state.settings.unit);

    // Funkcja pomocnicza do pobierania
    const fetchCity = async (name) => {
        // Sprawdź czy już nie mamy tego miasta
        if (cities.some(c => c.name.toLowerCase() === name.toLowerCase())) return;

        try {
            setLoading(true);
            const data = await getWeatherData(name);
            setCities(prev => [data, ...prev]);
        } catch (err) {
            console.error(err);
            alert("Nie znaleziono miasta: " + name);
        } finally {
            setLoading(false);
        }
    };

    // Pobierz domyślne miasta przy starcie
    useEffect(() => {
        if (cities.length === 0) {
            fetchCity('Warszawa');
            fetchCity('Kraków');
        }
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            fetchCity(searchTerm);
            setSearchTerm('');
        }
    };

    const convertTemp = (t, u) => u === 'F' ? Math.round(t * 1.8 + 32) : (u === 'K' ? Math.round(t + 273.15) : t);

    return (
        <div>
            <div className="mb-8 max-w-md mx-auto sm:mx-0">
                <input
                    type="text"
                    placeholder="Wpisz miasto i wciśnij Enter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {loading && <p className="text-center mb-4">Ładowanie...</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cities.map((city) => (
                    <div key={city.name} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{city.name}</h3>
                                    <span className="text-slate-500 text-sm font-medium">{city.condition}</span>
                                </div>
                                <WeatherIcon condition={city.condition} className="w-10 h-10" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">
                                {convertTemp(city.temp, unit)}°{unit}
                            </div>
                        </div>
                        {/* ZMIANA: Linkujemy po nazwie miasta */}
                        <Link to={`/city/${city.name}`} className="mt-4 block">
                            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                Szczegóły
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;