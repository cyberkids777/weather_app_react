import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleUnit } from './features/settingsSlice';
import Dashboard from './pages/Dashboard';
import CityDetails from './pages/CityDetails';

function App() {
    const unit = useSelector((state) => state.settings.unit);
    const dispatch = useDispatch();

    return (
        <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Link to="/" style={{ fontSize: '24px', textDecoration: 'none', fontWeight: 'bold' }}>
                    Weather App
                </Link>
                <button onClick={() => dispatch(toggleUnit())}>
                    Jednostka: °{unit}
                </button>
            </nav>

            <Routes>
                <Route path="/" element={<Dashboard />} />
                {/* Parametr URL :id pozwoli zidentyfikować miasto */}
                <Route path="/city/:id" element={<CityDetails />} />
            </Routes>
        </div>
    );
}

export default App;