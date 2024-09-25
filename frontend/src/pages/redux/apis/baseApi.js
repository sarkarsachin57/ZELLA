import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from './customFetchBase';
import { appendProjectItem, setProjectList } from '../features/baseSlice';

/**
 * 👇 @file handles the auth apis
 */


export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: customFetchBase,
    endpoints: (builder)=>({
      getProjectList: builder.mutation({
        query(data) {
          return {
            url: 'get-project-list',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setProjectList(data.project_list));
          } catch (error) {}
        },
      }),
      createProject: builder.mutation({
        query(data) {
          return {
            url: 'create-project',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(appendProjectItem(data.data))
          } catch (error) {}
        },
      }),
    }),
});

export const {
  useGetProjectListMutation,
  useCreateProjectMutation,

} = baseApi;
