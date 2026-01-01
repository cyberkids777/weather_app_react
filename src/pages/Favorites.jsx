import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { WeatherIcon } from '../components/WeatherIcon';
import { toggleFavorite } from '../features/settingsSlice';

const Favorites = () => {
    const { favorites, unit } = useSelector((state) => state.settings);
    const dispatch = useDispatch();

    const convertTemp = (t, u) => {
        if (u === 'F') return Math.round(t * 1.8 + 32);
        if (u === 'K') return Math.round(t + 273.15);
        return t;
    };

    if (favorites.length === 0) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Brak ulubionych miast</h2>
                <p className="text-slate-500 mb-6">Dodaj miasta do ulubionych, aby mieć do nich szybki dostęp.</p>
                <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Wróć do wyszukiwarki
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Twoje ulubione miasta</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((city) => (
                    <div
                        key={city.name}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col justify-between relative"
                    >
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // Zapobiega przejściu do szczegółów przy kliknięciu serca
                                dispatch(toggleFavorite(city));
                            }}
                            className="absolute top-4 right-4 text-red-500 hover:scale-110 transition-transform"
                        >
                            <Heart fill="currentColor" size={24} />
                        </button>

                        <div>
                            <div className="flex justify-between items-start mb-4 pr-8">
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
                            <button className="w-full py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors">
                                Szczegóły
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;