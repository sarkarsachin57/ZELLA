import { createApi } from '@reduxjs/toolkit/query/react'
import { userApi } from './userApi';
import customFetchBase from './customFetchBase';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: customFetchBase,
    endpoints: (builder)=>({
        registerUser: builder.mutation({
            query(data) {
                return {
                    url: 'user-signup',
                    method: 'POST',
                    body: data
                }
            }
        }),
        loginUser: builder.mutation({
            query(data) {
                return {
                    url: 'user-login',
                    method: 'POST',
                    body: data,
                }
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                  const { data } = await queryFulfilled;

                  localStorage.setItem("token", data.token);
                    console.log(data.token)
                  await dispatch(userApi.endpoints.getMe.initiate(args));
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
