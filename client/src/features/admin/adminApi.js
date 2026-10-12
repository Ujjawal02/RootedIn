import { apiSlice } from "../api/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPendingRequests: builder.query({
            query: () => "/admin/pending",
            transformResponse: (response) => response.requests,
            providesTags: [{type: 'Sponsorship', id: 'Pending'}],
        }),
        approveRequest: builder.mutation({
            query: (sponsorshipId) => ({
                url: `/admin/approve/${sponsorshipId}`,
                method: 'PUT'
            }),
            /** pending -> approved, so both lists need refreshing, plus the user's own MyTree view */
            invalidatesTags: [
                {type: 'Sponsorship', id: 'PENDING'},
                { type: 'Sponsorship', id: 'APPROVED' },,
                { type: 'Sponsorship', id: 'LIST' },
            ]
        }),
        rejectRequest: builder.mutation({
            query: (sponsorshipId) => ({
                url: `/admin/reject/${sponsorshipId}`,
                method: 'PUT'
            }),
            invalidatesTags: [
                {type: 'Sponsorship', id: 'PENDING'},
                {type: 'Sponsorship', id: 'LIST'}
            ],
        }),
        getApprovedUnassigned: builder.query({
            query: () => '/admin/approved',
            transformResponse: (response) => response.requests,
            providesTags: [{ type: 'Sponsorship', id: 'APPROVED' }],
        }),
        getFarmers: builder.query({
            query: () => '/admin/farmers',
            transformResponse: (response) => response.farmers,
        }),
        assignFarmer: builder.mutation({
            query: (body) => ({
                url: 'admin/assign',
                method: 'PUT',
                body
            })
        }),
        getAssignedTrees: builder.query({
            query: () => '/admin/assigned',
            transformResponse: (response) => response.requests,
            providesTags: [{ type: 'Sponsorship', id: 'ASSIGNED' }],
        }),
        getDeletedTrees: builder.query({
            query: () => '/admin/deleted-trees',
            transformResponse: (response) => response.trees,
            providesTags: [{ type: 'Tree', id: 'DELETED' }],
        }),
        restoreTree: builder.mutation({
            query: (treeId) => ({
                url: `/admin/restore/${treeId}`,
                method: 'PUT',
            }),
            invalidatesTags: [
                {type: 'Tree', id: 'DELETED'},
                {type: 'Tree', id: 'LIST'}
            ]
        })
    })
})

export const {useGetPendingRequestsQuery,
    useApproveRequestMutation, useRejectRequestMutation, useGetApprovedUnassignedQuery,
    useGetFarmersQuery, useAssignFarmerMutation, useGetAssignedTreesQuery,
    useGetDeletedTreesQuery, useRestoreTreeMutation
} = adminApi;