import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { WeatherIcon } from '../components/WeatherIcon';
import { getWeatherData } from '../api/weather';

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    // Dodajemy stan błędu dla wyszukiwania, żeby wyświetlić komunikat użytkownikowi
    const [searchError, setSearchError] = useState('');

    const unit = useSelector((state) => state.settings.unit);

    // Lista miast startowych
    const defaultCities = ['Racibórz', 'Opole', 'Wrocław'];

    // Funkcja bezpiecznego dodawania miasta (zapobiega duplikatom)
    const addCitySafe = (newCity) => {
        setCities(prevCities => {
            // Sprawdzamy, czy miasto o tym ID już istnieje w tablicy
            if (prevCities.some(city => city.id === newCity.id)) {
                return prevCities; // Jeśli tak, nic nie zmieniaj
            }
            // Jeśli nie, dodaj nowe miasto na początek listy
            return [newCity, ...prevCities];
        });
    };

    // Pobieranie miast startowych (tylko raz przy starcie)
    useEffect(() => {
        const fetchDefaults = async () => {
            setLoading(true);
            try {
                // Pobieramy dane dla wszystkich miast równolegle
                const promises = defaultCities.map(name => getWeatherData(name));
                const results = await Promise.all(promises);

                // Filtrujemy null/błędy i ustawiamy stan
                // Używamy unikalnych ID, żeby React Strict Mode nie narobił bałaganu
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

        // Wywołujemy tylko, jeśli lista jest pusta (żeby nie nadpisywać przy powrocie z detali)
        if (cities.length === 0) {
            fetchDefaults();
        }
    }, []); // Pusta tablica zależności = uruchom tylko raz

    // Obsługa wyszukiwania
    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            setSearchError(''); // Czyścimy stare błędy
            setLoading(true);

            try {
                const data = await getWeatherData(searchTerm);

                // Sprawdzamy duplikat PRZED próbą dodania (dla UX - opcjonalne)
                const alreadyExists = cities.some(c => c.id === data.id);

                if (alreadyExists) {
                    setSearchError(`Miasto ${data.name} jest już na liście.`);
                } else {
                    addCitySafe(data);
                    setSearchTerm(''); // Czyścimy input tylko przy sukcesie
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

    return (
        <div>
            {/* Sekcja Inputa */}
            <div className="mb-8 max-w-md mx-auto sm:mx-0 relative">
                <input
                    type="text"
                    placeholder="Wpisz miasto i wciśnij Enter..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSearchError(''); // Czyść błąd gdy użytkownik pisze
                    }}
                    onKeyDown={handleSearch}
                    disabled={loading} // Blokujemy input podczas ładowania
                    className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-slate-100"
                />

                {/* Komunikaty błędów pod inputem */}
                {searchError && (
                    <p className="text-red-500 text-sm mt-2 absolute">{searchError}</p>
                )}
            </div>

            {/* Spinner ładowania */}
            {loading && (
                <div className="text-center mb-6 text-blue-600 font-medium">
                    Ładowanie danych...
                </div>
            )}

            {/* Grid z miastami */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cities.map((city) => (
                    <div
                        key={city.id} // KLUCZOWE: ID z API musi być unikalne
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
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

                        {/* Linkujemy po NAZWIE, bo ID czasem w API bywa mylące przy Geocodingu, ale tutaj jest bezpiecznie */}
                        <Link to={`/city/${city.name}`} className="mt-4 block">
                            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                Szczegóły
                            </button>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Stan pusty */}
            {!loading && cities.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                    Brak miast do wyświetlenia. Wyszukaj coś!
                </div>
            )}
        </div>
    );
};

export default Dashboard;