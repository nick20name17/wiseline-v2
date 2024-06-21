import { api } from '..'

import type {
    FlowsAddData,
    FlowsData,
    FlowsPatchData,
    FlowsQueryParams,
    FlowsResponse
} from './flows.types'

export const flows = api.injectEndpoints({
    endpoints: (build) => ({
        getFlows: build.query<FlowsResponse, Partial<FlowsQueryParams>>({
            query: (params) => ({
                url: 'flows/',
                params
            }),

            providesTags: ['Flows']
        }),
        getAllFlows: build.query<FlowsData[], void>({
            query: () => 'flows/all/',
            providesTags: ['Flows']
        }),
        addFlow: build.mutation<void, FlowsAddData>({
            query: (data) => ({
                url: `flows/`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Flows', 'Stage', 'Categories']
        }),
        patchFlow: build.mutation<void, FlowsPatchData>({
            query: ({ data, id }) => ({
                url: `flows/${id}/`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Flows']
        }),
        removeFlow: build.mutation<void, number>({
            query: (id) => ({
                url: `flows/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Flows', 'Categories', 'Stage']
        })
    })
})

export const {
    useGetFlowsQuery,
    useGetAllFlowsQuery,
    useAddFlowMutation,
    usePatchFlowMutation,
    useRemoveFlowMutation
} = flows
