import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from './customFetchBase';

/**
 * 👇 @file handles the auth apis
 */


export const baseApi = createApi({
    reducerPath: 'authApi',
    baseQuery: customFetchBase,
    endpoints: (builder)=>({
      createProject: builder.mutation({
          query(data) {
            return {
              url: 'get-errors-logs',
              method: 'GET',

              // body: data
            }
          },
          transformResponse: result => result,

      }),
    }),
});

export const {
  useCreateProjectMutation,

} = baseApi;
