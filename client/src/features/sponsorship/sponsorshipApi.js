import {apiSlice} from '../../features/api/apiSlice'

export const sponsorshipApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        directCheckout: builder.query({
            query: (treeId) => `/sponsorship/checkout/direct/${treeId}`,
        }),

        cartItemCheckout: builder.query({
            query: (cartId) => `/sponsorship/checkout/cart/${cartId}`
        }),

        cartCheckout: builder.query({
            query: () => `/sponsorship/checkout/cart`
        }),

        confirmSponsorship: builder.mutation({
            query: (body) => ({
                url: `/sponsorship/confirm`,
                method: 'POST',
                body
            }),
            invalidatesTags: [{type: 'Cart', id: 'LIST'}, { type: 'Sponsorship', id: 'LIST' }]
        }),

        getGrowthUpdates: builder.query({
            query: (sponsorshipId) => `/sponsorship/${sponsorshipId}/updated`,
            transformResponse: (response) => response.updates,
            providesTags: (result, erro, sponsorshipId) => 
            [{ type: 'Sponsorship', id: sponsorshipId }],
        })

    }),
})

export const {
    useDirectCheckoutQuery,useCartItemCheckoutQuery,
     useCartCheckoutQuery,
     useConfirmSponsorshipMutation,
    useGetGrowthUpdatesQuery
} = sponsorshipApi;