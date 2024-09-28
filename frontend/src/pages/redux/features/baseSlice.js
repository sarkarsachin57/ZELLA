import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState ={
    projectList: [],
    dataSetList: [],
    latestProjectUrl: ""
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
        },
        setDataSetList: (state, action) => {
            state.dataSetList = action.payload
        },
        appendDataSetItem: (state, action) => {
            state.dataSetList = [...state.dataSetList, action.payload]
        },
        updateLatestProjectUrl: (state, action) => {
            state.latestProjectUrl = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
    setProjectList,
    appendProjectItem,
    setDataSetList,
    appendDataSetItem,
    updateLatestProjectUrl
 } = baseSlice.actions;

export default baseSlice.reducer;
