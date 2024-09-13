import { createSlice } from "@reduxjs/toolkit";
import { TRUST_MODE, TRUST_METHOD, TRUST_VIEWMODE} from "src/constants";

const initialState = {
  modeType: TRUST_MODE.online,
  methodType:  TRUST_METHOD.tracking,
  viewMode: TRUST_VIEWMODE.detect
}

export const siteSettingSlice = createSlice({
  name: 'siteSettingSlice',
  initialState: initialState,
  reducers: {
    switchMode: (state, action) => {
      console.log('switch mode type', action);
      state.modeType = action.payload
    },
    switchMethod: (state, action) => {
      console.log('switch method type', action);
      state.methodType = action.payload
    },
    switchViewMode: (state, action) => {
      console.log('switch ViewMode', action);
      state.viewMode = action.payload
    }
  }
});

export const {
  switchMode, 
  switchMethod,
  switchViewMode
} = siteSettingSlice.actions;

export default siteSettingSlice.reducer

