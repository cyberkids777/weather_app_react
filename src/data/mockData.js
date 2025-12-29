export const citiesData = [
    {
        id: 1,
        name: "Warszawa",
        temp: 22,
        condition: "Sunny",
        clouds: 10,
        windSpeed: 15,
        windDir: "NW",
        precipProb: 5,
        precipAmount: 0,
        forecast: [
            { day: "Pn", temp: 21, condition: "Cloudy" },
            { day: "Wt", temp: 23, condition: "Sunny" },
            { day: "Śr", temp: 19, condition: "Rain" },
            { day: "Cz", temp: 20, condition: "Cloudy" },
            { day: "Pt", temp: 22, condition: "Sunny" },
        ]
    },
    {
        id: 2,
        name: "Kraków",
        temp: 18,
        condition: "Rain",
        clouds: 80,
        windSpeed: 10,
        windDir: "S",
        precipProb: 90,
        precipAmount: 5.2,
        forecast: [ /* ... kolejne 5 dni ... */ ]
    },
    // Dodaj co najmniej 3 kolejne miasta, aby mieć 5
];