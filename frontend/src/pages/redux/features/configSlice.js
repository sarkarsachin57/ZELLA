import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  configs: [

  ],
}

export const ConfigSlice = createSlice({
  name: 'configSlice',
  initialState: initialState,
  reducers: {
    addConfig: (state, action) => {
      state.configs = [...state.configs, action.payload]
    },

    setConfigs: (state, action) => {
      state.configs = action.payload
    },

    updateConfig: (state, action) => {
      state.configs = state.configs.map((config)=>{
        // if (config._id == action.payload._id) return action.payload // works 2023/03/04
        if (config._id == action.payload._id) {
          return {...config, ...action.payload}  // updated by QmQ 2023/03/05
        }
        return config
      })
      // state.configs = [...state.configs, action.payload]
    },

    deleteConfig: (state, action) => {
      state.configs = (state.configs).filter((config)=> config._id !== action.payload)
    }
  }
});

export const { addConfig, setConfigs, updateConfig, deleteConfig } = ConfigSlice.actions;

export default ConfigSlice.reducer

