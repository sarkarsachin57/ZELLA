import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from './customFetchBase'
import { useDispatch } from 'react-redux';
import { addConfig, setConfigs, updateConfig, deleteConfig} from '../features/configSlice';

/**
 * @file handles the connection apis.
 */
export const configApi = createApi({
  reducerPath: 'configApi',
  baseQuery: customFetchBase,
  tagTypes: ['Configs'],
  endpoints: builder => ({
    createConfig: builder.mutation({

      query(config) {
        return {
          url: '/configs',
          body: config,
          method: 'POST',
          credentials: 'include'
        }
      },

      invalidatesTags: ['Configs'],

      // invalidatesTags: [{ type: 'Configs', id: 'LIST' }],
      transformResponse: result => {
        return result.data.config
      },
      async onQueryStarted( args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addConfig(data))
        } catch (error) {
        }
      }
    }),

    updateConfig: builder.mutation({
      query({id, update}) {
        return {
          url: `/configs/update`,
          body:{id: id, data: update},
          method: 'POST',
          credentials: 'include'
        }
      },
      invalidatesTags: ['Configs'],
      transformResponse: result => {
        return result.data.config
      },
      async onQueryStarted( args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateConfig(data))
        } catch (error) {
        }
      }
    }),

    getConfig: builder.query({
      query(id) {
        return {
          url: `/configs/${id}`,
          body: config,
          method: 'GET',
          credentials: 'include'
        }
      },
      providesTags: ['Configs']
    }),

    getAllConfigs: builder.query({
      query() {
        return {
          url: '/configs',
          method: 'GET',
          credentials: 'include'
        }
      },
      providesTags: ['Configs'],

      transformResponse: (result) =>
      result.data.configs,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setConfigs(data));
        } catch (error) {}
      },
    }),

    deleteConfig: builder.mutation({
      query(id) {
        return {
          url: `/configs/delete`,
          body: {id: id},
          method: 'POST',
          credentials: 'include'
        }
      },
      invalidatesTags: ['Configs'],
      transformResponse: (result) => {
        return result
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {          
          const { data } = await queryFulfilled;
          if (data.status == 'success') {
            dispatch(deleteConfig(data.data.id)); 
          }
        } catch (error) {
        }
      },
    })
  })
})



export const {
  useCreateConfigMutation,
  useUpdateConfigMutation,
  useDeleteConfigMutation,
  useGetAllConfigsQuery,
  useGetConfigQuery,
} = configApi
