import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logs: [

  ],
}

export const logSlice = createSlice({
  name: 'logSlice',
  initialState: initialState,
  reducers: {
    addLog: (state, action) => {
      state.logs = [...state.logs, action.payload]
    },

    setLogs: (state, action) => {
      state.logs = action.payload
    },

    updateLog: (state, action) => {
      state.logs = [...state.logs, action.payload]
    },

    deleteLog: (state, action) => {
      state.logs = (state.logs).filter((log)=> log.id != action.payload.id)
    }
  }
});

export const { addLog, setLogs, updateLog, deleteLog } = logSlice.actions;

export default logSlice.reducer

