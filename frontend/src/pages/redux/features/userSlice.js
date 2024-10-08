import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState ={
    user: null
}

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        logout: () => initialState,
        setUser: (state, action) =>{
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.user = action.payload;
        },
    }
});

// Action creators are generated for each case reducer function
export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer;
