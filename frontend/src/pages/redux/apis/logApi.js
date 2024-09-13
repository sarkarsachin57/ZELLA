import { createApi } from "@reduxjs/toolkit/dist/query/react";
import customFetchBase from "./customFetchBase";

/**
 * @file handles the log api
 */
export const logApi = createApi({
  reducerPath: 'LogApi',
  baseQuery: customFetchBase,
  tagTypes: ['Logs'],
  endpoints: builder => ({

    // =================== [Default] Logs Endpoints ===========
    createLog: builder.mutation({

      query(log) {
        return {
          url: '/logs/create',
          body: log,
          method: 'POST',
          credentials: 'include'
        }
      },

      invalidatesTags: ['Logs'],
      // invalidatesTags: [{ type: 'Logs', id: 'LIST' }],
    }),

    createManyLogs: builder.mutation({

      query(logs) {
        return {
          url: '/logs/createMany',
          body: logs,
          method: 'POST',
          credentials: 'include'
        }
      },

      invalidatesTags: ['Logs'],
    }),

    getFilteredLogs: builder.mutation({
      query(filter) {
        return {
          url: '/logs/get_filtered',
          method: 'POST',
          body: filter,
          credentials: 'include'
        }
      },
      providesTags: ['Logs'],

      transformResponse: (result) => {
        return result.data.logs;
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {}
      },
    }),

    getAllLogs: builder.query({
      query() {
        return {
          url: '/logs',
          method: 'GET',
          credentials: 'include'
        }
      },
      providesTags: ['Logs'],

      transformResponse: (result) =>
      result.data.logs,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setLogs(data));
        } catch (error) {}
      },
    }),

    // =================== Detection Logs Endpoints ===========
    createDetectionLog: builder.mutation({

      query(log) {
        return {
          url: '/logs/detection/create',
          body: log,
          method: 'POST',
          credentials: 'include'
        }
      },

      invalidatesTags: ['Logs'],
      // invalidatesTags: [{ type: 'Logs', id: 'LIST' }],
    }),

    createManyDetectionLogs: builder.mutation({
      query(logs) {
        return {
          url: '/logs/detection/createMany',
          body: logs,
          method: 'POST',
          credentials: 'include'
        }
      },

      invalidatesTags: ['Logs'],
    }),


    getFilteredDetectionLogs: builder.mutation({
      query(filter) {
        return {
          url: '/logs/detection/get_filtered',
          method: 'POST',
          body: filter,
          credentials: 'include'
        }
      },
      providesTags: ['Logs'],

      transformResponse: (result) => {
        return result.data.logs;
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {}
      },
    }),

    getMediaNames: builder.mutation({
      query() {
        return {
          url: '/logs/detection/get_media_names',
          method: 'GET',
          credentials: 'include'
        }
      },
      providesTags: ['Logs'],

      transformResponse: (result) => {
        return result.data.names;
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {}
      },
    }),

    getAllDetectionLogs: builder.query({
      query() {
        return {
          url: '/logs/detection',
          method: 'GET',
          credentials: 'include'
        }
      },
      providesTags: ['Logs'],

      transformResponse: (result) =>
      result.data.logs,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setLogs(data));
        } catch (error) {}
      },
    }),
  })
})

export const {
  // ======== [default] tracking logs ========
  useCreateLogMutation,
  useCreateManyLogsMutation,
  useGetAllLogsQuery,
  useGetFilteredLogsMutation,
  
  // ======== detection logs =================
  useCreateDetectionLogMutation,
  useCreateManyDetectionLogsMutation,
  useGetAllDetectionLogsQuery,
  useGetFilteredDetectionLogsMutation,
  useGetMediaNamesMutation,
} = logApi;
