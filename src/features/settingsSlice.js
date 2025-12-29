import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    unit: 'C', // C, F, K
    favorites: [] // Na ocenę 4.5 [cite: 43]
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleUnit: (state) => {
            // Prosta logika przełączania C -> F -> K -> C
            if (state.unit === 'C') state.unit = 'F';
            else if (state.unit === 'F') state.unit = 'K';
            else state.unit = 'C';
        },
        // Tu dodasz akcje addToFavorites na wyższą ocenę
    },
});

export const { toggleUnit } = settingsSlice.actions;
export default settingsSlice.reducer;