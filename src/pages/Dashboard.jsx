import { useState } from 'react';
import { Link } from 'react-router-dom';
import { citiesData } from '../data/mockData';
import { useSelector } from 'react-redux';

// Helper do konwersji (będziesz go używał często)
const convertTemp = (temp, unit) => {
    if (unit === 'F') return Math.round(temp * 1.8 + 32);
    if (unit === 'K') return Math.round(temp + 273.15);
    return temp;
};

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Na ocenę 4.0
    const unit = useSelector((state) => state.settings.unit);

    const filteredCities = citiesData.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Szukaj miasta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '10px', width: '100%', marginBottom: '20px' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {filteredCities.map((city) => (
                    <div key={city.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <h3>{city.name}</h3>
                        <p>Temp: {convertTemp(city.temp, unit)}°{unit}</p>
                        <p>Warunki: {city.condition}</p>
                        {/* Link do szczegółów  */}
                        <Link to={`/city/${city.id}`}>
                            <button style={{ marginTop: '10px' }}>Szczegóły</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;