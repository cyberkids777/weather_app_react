import { createSlice } from '@reduxjs/toolkit';

const getInitialFavorites = () => {
    try {
        const stored = localStorage.getItem('weatherAppFavorites');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Błąd odczytu localStorage:", error);
        return [];
    }
};

const initialState = {
    unit: 'C',
    favorites: getInitialFavorites()
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleUnit: (state) => {
            if (state.unit === 'C') state.unit = 'F';
            else if (state.unit === 'F') state.unit = 'K';
            else state.unit = 'C';
        },
        toggleFavorite: (state, action) => {
            const cityToAdd = action.payload;
            const existsIndex = state.favorites.findIndex(city => city.name === cityToAdd.name);

            if (existsIndex >= 0) {
                state.favorites.splice(existsIndex, 1);
            } else {
                state.favorites.push({
                    id: cityToAdd.id,
                    name: cityToAdd.name,
                    temp: cityToAdd.temp,
                    condition: cityToAdd.condition
                });
            }

            localStorage.setItem('weatherAppFavorites', JSON.stringify(state.favorites));
        }
    },
});

export const { toggleUnit, toggleFavorite } = settingsSlice.actions;
export default settingsSlice.reducer;