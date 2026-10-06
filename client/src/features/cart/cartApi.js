import { apiSlice } from "../api/apiSlice";

export const cartApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => '/cart',
            transformResponse: (response) => response.cartItems,
            providesTags: (result) => 
                result 
                    ? [...result.map(({_id}) => ({type: 'Cart', id: _id})),
                        {type: 'Cart', id: 'LIST'}]
                    :
                    [{type: 'Cart', id: 'LIST'}]
        }),
        addToCart: builder.mutation({
            query: (treeId) => ({
                url: `/cart/add/${treeId}`,
                method: 'POST'
            }),
            invalidatesTags: [{type: 'Cart', id: 'LIST'}]
        }),
        increaseQuantity: builder.mutation({
            query: (cartId) => ({
                url: `/cart/increase/${cartId}`,
                method: 'PUT'
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),

        decreaseQuantity: builder.mutation({
            query: (cartId) => ({
                url: `/cart/decrease/${cartId}`,
                method: 'PUT'
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),

        removeFromCart: builder.mutation({
            query: (cartId) => ({
                url: `/cart/${cartId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
    })
});

export const {
    useGetCartQuery, useAddToCartMutation, 
    useIncreaseQuantityMutation, useDecreaseQuantityMutation, 
    useRemoveFromCartMutation
} = cartApi;