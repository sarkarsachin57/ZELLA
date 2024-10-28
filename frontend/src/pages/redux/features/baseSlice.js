import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState ={
    projectList: [],
    dataSetList: [],
    latestProjectUrl: "",
    run_logs_list: [],
    history: undefined,
    datasetInfo: {},
    sample_paths: [],
    simpleImageUrl: '',
    noiseHistory: [],
    modelEvaluationLogs: [],
    splitDataLogs: [],
}

export const baseSlice = createSlice({
    name: 'baseSlice',
    initialState,
    reducers: {
        setProjectList: (state, action) => {
            state.projectList = action.payload
            console.log('state: projectList: ',state.projectList)
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
        },
        setRunLosgList: (state, action) => {
            state.run_logs_list = action.payload
        },
        setTrainingViewDetail: (state, action) => {
            state.history = action.payload
        },
        setDatasetInfo: (state, action) => {
            state.datasetInfo = action.payload
        },
        setViewSample: (state, action) => {
            state.sample_paths = action.payload
        },
        setSimpleImageUrl: (state, action) => {
            state.simpleImageUrl = action.payload
        },
        setNoiseHistory: (state, action) => {
            state.noiseHistory = action.payload
        },
        setModelEvaluationLogs: (state, action) => {
            state.modelEvaluationLogs = action.payload
        },
        setSplitDataset: (state, action) => {
            state.splitDataLogs = action.payload
        },
    }
});

// Action creators are generated for each case reducer function
export const { 
    setProjectList,
    appendProjectItem,
    setDataSetList,
    appendDataSetItem,
    updateLatestProjectUrl,
    setRunLosgList,
    setTrainingViewDetail,
    setDatasetInfo,
    setViewSample,
    setSimpleImageUrl,
    setNoiseHistory,
    setModelEvaluationLogs,
    setSplitDataset
 } = baseSlice.actions;

export default baseSlice.reducer;
