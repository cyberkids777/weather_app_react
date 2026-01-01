import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart } from 'lucide-react';
import { WeatherIcon } from '../components/WeatherIcon';
import { getWeatherData } from '../api/weather';
import { toggleFavorite } from '../features/settingsSlice';

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState('');

    const { unit, favorites } = useSelector((state) => state.settings);
    const dispatch = useDispatch();

    const defaultCities = ['Racibórz', 'Opole', 'Wrocław'];

    const addCitySafe = (newCity) => {
        setCities(prevCities => {
            if (prevCities.some(city => city.id === newCity.id)) {
                return prevCities;
            }
            return [newCity, ...prevCities];
        });
    };

    useEffect(() => {
        const fetchDefaults = async () => {
            setLoading(true);
            try {
                const promises = defaultCities.map(name => getWeatherData(name));
                const results = await Promise.all(promises);

                const uniqueResults = results.reduce((acc, current) => {
                    const x = acc.find(item => item.id === current.id);
                    if (!x) return acc.concat([current]);
                    return acc;
                }, []);

                setCities(uniqueResults);
            } catch (err) {
                console.error("Błąd pobierania domyślnych miast:", err);
            } finally {
                setLoading(false);
            }
        };

        if (cities.length === 0) {
            fetchDefaults();
        }
    }, []);

    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            setSearchError('');
            setLoading(true);

            try {
                const data = await getWeatherData(searchTerm);
                const alreadyExists = cities.some(c => c.id === data.id);

                if (alreadyExists) {
                    setSearchError(`Miasto ${data.name} jest już na liście.`);
                } else {
                    addCitySafe(data);
                    setSearchTerm('');
                }
            } catch (err) {
                console.error(err);
                setSearchError("Nie znaleziono takiego miasta.");
            } finally {
                setLoading(false);
            }
        }
    };

    const convertTemp = (t, u) => {
        if (u === 'F') return Math.round(t * 1.8 + 32);
        if (u === 'K') return Math.round(t + 273.15);
        return t;
    };

    const isFavorite = (cityName) => favorites.some(fav => fav.name === cityName);

    return (
        <div>
            <div className="mb-8 max-w-full mx-auto sm:mx-0 relative">
                <input
                    type="text"
                    placeholder="Wpisz miasto i wciśnij Enter..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSearchError('');
                    }}
                    onKeyDown={handleSearch}
                    disabled={loading}
                    className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-slate-100"
                />
                {searchError && (
                    <p className="text-red-500 text-sm mt-2 absolute">{searchError}</p>
                )}
            </div>

            {loading && (
                <div className="text-center mb-6 text-blue-600 font-medium">
                    Ładowanie danych...
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cities.map((city) => {
                    const isFav = isFavorite(city.name);

                    return (
                        <div
                            key={city.id}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col justify-between relative"
                        >
                            <button
                                onClick={() => dispatch(toggleFavorite(city))}
                                className={`absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors ${isFav ? 'text-red-500' : 'text-slate-300'}`}
                                title={isFav ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                            >
                                <Heart fill={isFav ? "currentColor" : "none"} size={24} />
                            </button>

                            <div>
                                <div className="flex justify-between items-start mb-4 pr-8"> {/* pr-8 żeby tekst nie wchodził na serce */}
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{city.name}</h3>
                                        <span className="text-slate-500 text-sm font-medium">
                                            {city.condition}
                                        </span>
                                    </div>
                                    <WeatherIcon
                                        condition={city.condition}
                                        className="w-10 h-10 drop-shadow-sm"
                                    />
                                </div>

                                <div className="text-4xl font-bold text-slate-900 mb-2">
                                    {convertTemp(city.temp, unit)}°{unit}
                                </div>
                            </div>

                            <Link to={`/city/${city.name}`} className="mt-4 block">
                                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                    Szczegóły
                                </button>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {!loading && cities.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                    Brak miast do wyświetlenia. Wyszukaj coś!
                </div>
            )}
        </div>
    );
};

export default Dashboard;