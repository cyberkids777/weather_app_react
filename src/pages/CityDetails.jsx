import { useParams, Link } from 'react-router-dom';
import { citiesData } from '../data/mockData';
import { useSelector } from 'react-redux';

const CityDetails = () => {
    const { id } = useParams();
    const unit = useSelector((state) => state.settings.unit);

    // Znajdź miasto po ID
    const city = citiesData.find(c => c.id === parseInt(id));

    if (!city) return <div>Nie znaleziono miasta.</div>;

    const convert = (t) => {
        // Prosta logika konwersji w miejscu (można wydzielić do utils)
        if (unit === 'F') return Math.round(t * 1.8 + 32);
        if (unit === 'K') return Math.round(t + 273.15);
        return t;
    };

    return (
        <div>
            <Link to="/">&larr; Wróć do listy</Link>
            <h1>{city.name}</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div>
                    <h2>{convert(city.temp)}°{unit}</h2>
                    <p>{city.condition}</p>
                </div>
                <div>
                    {/* Szczegółowe dane [cite: 13, 14, 15] */}
                    <p>Wiatr: {city.windSpeed} km/h ({city.windDir})</p>
                    <p>Opady: {city.precipAmount} mm ({city.precipProb}%)</p>
                    <p>Zachmurzenie: {city.clouds}%</p>
                </div>
            </div>

            <h3>Prognoza na 5 dni [cite: 12]</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
                {city.forecast?.map((day, index) => (
                    <div key={index} style={{ border: '1px solid #eee', padding: '10px' }}>
                        <strong>{day.day}</strong>
                        <p>{convert(day.temp)}°{unit}</p>
                        <p>{day.condition}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CityDetails;