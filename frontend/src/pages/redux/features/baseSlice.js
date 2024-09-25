import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState ={
    projectList: []
}

export const baseSlice = createSlice({
    name: 'baseSlice',
    initialState,
    reducers: {
        setProjectList: (state, action) => {
            state.projectList = action.payload
        },
        appendProjectItem: (state, action) => {
            state.projectList = [...state.projectList, action.payload]
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
    setProjectList,
    appendProjectItem
 } = baseSlice.actions;

export default baseSlice.reducer;
