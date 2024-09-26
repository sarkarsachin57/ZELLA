import { createApi } from '@reduxjs/toolkit/query/react';
import { setConfigs } from '../features/configSlice';
import { setUser } from '../features/userSlice';
import customFetchBase from './customFetchBase';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customFetchBase,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getMe: builder.query({
      query() {
        const formData = new FormData();
        formData.append('email', localStorage.getItem('email'));

        return {
          url: 'get-user-data',
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['User'],

      transformResponse: (result) =>{
        return result.data;
      },

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {}
      },
    }),

    updateUser: builder.mutation({
      query({id, update}) {
        return{
          url: 'users/updateUser',
          method: 'POST',
          credentials: 'include',
          body: {id: id, data: update}
        }
      },
      invalidatesTags: ['User'],
      transformResponse: (result) =>
        result,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data.user));
        } catch (error) {}
      },
    }),

    updatePassword: builder.mutation({
      query({ id, update }) {
        console.log("===> update password part<===")
        console.log(id, update)

        return {
          url: 'users/updatePassword',
          method: 'POST',
          credentials: 'include',
          body: {
            id: id,
            currentPassword: update.currentPassword,
            newPassword: update.newPassword
          }
        }
      }
    }),
    uploadImage: builder.mutation({
      query( formData ) {
        return {
          url: 'users/uploadImage',
          method: 'POST',
          credentials: 'include',
          body:   formData
        }
      },

      invalidatesTags: ['User'],
      transformResponse: (result) =>
      result,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data.user));
        } catch (error) {
        }
      },
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useUploadImageMutation
} = userApi;
