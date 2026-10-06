import { apiSlice } from '../api/apiSlice';

export const myTreeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyTree: builder.query({
      query: () => '/sponsorship/mine',
      transformResponse: (response) => response.sponsorships,
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Sponsorship', id: _id })), { type: 'Sponsorship', id: 'LIST' }]
          : [{ type: 'Sponsorship', id: 'LIST' }],
    }),
  }),
});

export const { useGetMyTreeQuery } = myTreeApi;