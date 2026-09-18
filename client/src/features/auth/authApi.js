import { apiSlice } from "../api/apiSlice";

import { setCredentials, logout as logoutAction } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (body) => ({
                url: '/auth/signup',
                method: 'POST',
                body
            })
        }),

        login: builder.mutation({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setCredentials(data.user));
                } catch(err){
                    /*Login failed - the component's own error handles this, nothing to dispatch*/
                    console.log(err);
                }
            }
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}){
                await queryFulfilled;
                dispatch(logoutAction());
            }
        }),

        getMe: builder.query({
            query: () => '/auth/getme',
            async onQueryStarted(arg, {dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setCredentials(data.user));
                } catch(err){
                    console.log("getMe FAILED (expected on first load):", err);
                    dispatch(logoutAction());
                }
            }
        })
    })
})

export const {useSignupMutation, useLoginMutation, useLogoutMutation, useGetMeQuery} = authApi;