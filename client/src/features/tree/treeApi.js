import { apiSlice } from "../api/apiSlice";

export const treeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTrees: builder.query({
            query: () => '/trees',
            transformResponse: (response) => response.trees,
            providesTags: (result) => 
                result ? [...result.map(({_id}) => ({type:'Tree', id: _id})), {type:'Tree', id: 'LIST'}]
                    : [{type: 'Tree', id: 'LIST'}],
        }),

        getTreeById: builder.query({
            query: (id) => `/trees/${id}`,
            transformResponse: (response) => response.tree,
            providesTags: (result, error, id) => [{type: 'Tree', id}],
        }),

        createTree: builder.mutation({
            query: (formData) => ({
                url: '/trees',
                method: 'POST',
                body: formData
            }),
            invalidatesTags: [{type: 'Tree', id: 'LIST'}],
        }),

        updateTree: builder.mutation({
            query: ({id, formData}) => ({
                url: `/trees/${id}`,
                method: 'PUT',
                body: formData
            }),
            invalidatesTags: (result, error, {id}) => [{type: 'Tree', id}, {type: 'Tree', id: 'LIST'}],
        }),

        deleteTree: builder.mutation({
            query: (id) => ({
                url: `/trees/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'Tree', id: 'LIST'}],
        })
    })
})

export const {useGetTreesQuery, useGetTreeByIdQuery, useCreateTreeMutation, useUpdateTreeMutation, useDeleteTreeMutation} = treeApi;