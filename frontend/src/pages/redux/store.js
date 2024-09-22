import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { useDispatch, useSelector } from 'react-redux';
import userReducer from './features/userSlice'
import configReducer from './features/configSlice'
import  logReducer from './features/logSlice'
import streamReducer from './features/streamSlice'
import siteSettingReducer from './features/siteSettingSlice'


import { authApi } from './apis/authApi'
import { userApi } from './apis/userApi'
import { configApi } from './apis/configApi'
import { logApi } from './apis/logApi';
import { streamApi } from './apis/edfsdf';

/**
 * @file => central store.
 */
export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [configApi.reducerPath]: configApi.reducer,
        [logApi.reducerPath]: logApi.reducer,
        [streamApi.reducerPath]: streamApi.reducer,

        userState: userReducer,
        configState: configReducer,
        logState: logReducer,
        streamState: streamReducer,
        siteSettingState: siteSettingReducer,
    },
    devTools: process.env.PROJECT_STATUS === 'development',
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
        authApi.middleware,
        userApi.middleware,
        configApi.middleware,
        logApi.middleware,
        streamApi.middleware,
    ]),
});

setupListeners(store.dispatch)
