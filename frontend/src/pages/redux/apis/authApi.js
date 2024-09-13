import { createApi } from '@reduxjs/toolkit/query/react'
import { userApi } from './userApi';
import customFetchBase from './customFetchBase';

/**
 * 👇 @file handles the auth apis
 */

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: customFetchBase,
    endpoints: (builder)=>({
        registerUser: builder.mutation({
            query(data) {
                return {
                    url: 'auth/register',
                    method: 'POST',
                    body: data
                }
            }
        }),
        loginUser: builder.mutation({
            query(data) {
                return {
                    url: 'auth/login',
                    method: 'POST',
                    body: data,
                    credentials: 'include'
                }
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    await dispatch(userApi.endpoints.getMe.initiate(null));
                } catch (error) {
                }
            },
        }),
        logoutUser: builder.mutation({
            query(){
                return {
                    url: 'auth/logout',
                    credentials: 'include'
                }
            }
        }),
         verifyEmail: builder.mutation({

          query( {email, _verifyCode} ) {
            return {
              url: 'auth/verifyEmail',
              method: 'POST',
              body: {email, _verifyCode},
              credentials: 'include'
            }
          }
        })
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useVerifyEmailMutation
} = authApi;
