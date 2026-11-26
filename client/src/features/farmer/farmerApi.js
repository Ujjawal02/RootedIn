import { apiSlice } from '../api/apiSlice';

export const farmerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAssignedTrees: builder.query({
      query: () => '/farmer/assigned',
      transformResponse: (response) => response.assigned,
      providesTags: [{ type: 'Sponsorship', id: 'FARMER_ASSIGNED' }],
    }),
    markCompleted: builder.mutation({
      query: (sponsorshipId) => ({ url: `/farmer/complete/${sponsorshipId}`, method: 'PUT' }),
      // invalidates the farmer's own view AND admin's "assigned" view AND the sponsor's MyTree —
      // all three show this same record, just from different angles
      invalidatesTags: [
        { type: 'Sponsorship', id: 'FARMER_ASSIGNED' },
        { type: 'Sponsorship', id: 'ASSIGNED' },
        { type: 'Sponsorship', id: 'LIST' },
      ],
    }),
    postGrowthUpdate: builder.mutation({
      query: ({ sponsorshipId, formData }) => ({ url: `/farmer/updates/${sponsorshipId}`, method: 'POST', body: formData }),
      invalidatesTags: (result, error, { sponsorshipId }) => [{ type: 'Sponsorship', id: sponsorshipId }],
    }),
  }),
});

export const { useGetMyAssignedTreesQuery, useMarkCompletedMutation, usePostGrowthUpdateMutation } = farmerApi;