import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleUnit } from './features/settingsSlice';
import { Heart } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CityDetails from './pages/CityDetails';
import Favorites from './pages/Favorites';

function App() {
    const { unit, favorites } = useSelector((state) => state.settings);
    const dispatch = useDispatch();
    const location = useLocation();

    const isFavPage = location.pathname === '/favorites';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Weather App
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Link do Ulubionych */}
                        <Link
                            to="/favorites"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isFavPage ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Heart size={20} className={favorites.length > 0 ? "text-red-500" : ""} fill={favorites.length > 0 ? "currentColor" : "none"} />
                            <span className="hidden sm:inline font-medium">Ulubione ({favorites.length})</span>
                        </Link>

                        <button
                            onClick={() => dispatch(toggleUnit())}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-sm sm:text-base w-32"
                        >
                            Jednostka: <span className="font-bold">°{unit}</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/favorites" element={<Favorites />} /> {/* Nowa trasa */}
                    <Route path="/city/:cityName" element={<CityDetails />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;