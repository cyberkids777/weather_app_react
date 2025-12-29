import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleUnit } from './features/settingsSlice';
import Dashboard from './pages/Dashboard';
import CityDetails from './pages/CityDetails';

function App() {
    const unit = useSelector((state) => state.settings.unit);
    const dispatch = useDispatch();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Pasek nawigacji */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Weather App
                    </Link>

                    <button
                        onClick={() => dispatch(toggleUnit())}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                        Jednostka: <span className="font-bold">°{unit}</span>
                    </button>
                </div>
            </nav>

            {/* Główna zawartość */}
            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/city/:cityName" element={<CityDetails />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;