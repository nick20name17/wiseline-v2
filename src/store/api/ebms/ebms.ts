import { api } from '..'

import type {
    AllCategoriesData,
    CalendarQueryParams,
    CalendarResponse,
    CategoriesQueryParams,
    CategoriesResponse,
    EBMSItemPatchData,
    EBMSItemsQueryParams,
    EBMSItemsResponse,
    OrderItemsQueryParams,
    OrderQueryParams,
    OrdersData,
    OrdersItemsResponse,
    OrdersQueryParams,
    OrdersResponse
} from './ebms.types'
import { getQueryParamString } from '@/utils'

export const embs = api.injectEndpoints({
    endpoints: (build) => ({
        getCalendar: build.query<CalendarResponse, CalendarQueryParams>({
            query: ({ year, month }) => `ebms/calendar/${year}/${month}/`,
            providesTags: ['Calendar']
        }),
        getCategories: build.query<CategoriesResponse, Partial<CategoriesQueryParams>>({
            query: (params) => ({
                url: 'ebms/categories/',
                params
            }),
            providesTags: ['Categories']
        }),
        getAllCategories: build.query<AllCategoriesData[], void>({
            query: () => 'ebms/categories/all/',
            providesTags: ['Categories']
        }),
        getOrders: build.query<OrdersResponse, Partial<OrdersQueryParams>>({
            query: (params) => {
                const queryParamString = getQueryParamString(params)
                return `ebms/orders/?${queryParamString}`
            },
            providesTags: ['Orders']
        }),
        getOrder: build.query<OrdersData, Partial<OrderQueryParams>>({
            query: ({ autoid }) => `ebms/orders/${autoid}/`
        }),
        getItems: build.query<EBMSItemsResponse, Partial<EBMSItemsQueryParams>>({
            query: (params) => {
                const queryParamString = getQueryParamString(params)
                return `ebms/items/?${queryParamString}`
            },
            providesTags: ['EBMSItems']
        }),
        getOrdersItems: build.query<OrdersItemsResponse, Partial<OrderItemsQueryParams>>({
            query: (params) => ({
                url: 'ebms/orders-items',
                params
            })
        }),
        patchEBMSItem: build.mutation<void, EBMSItemPatchData>({
            query: ({ data, id }) => ({
                url: `ebms/orders/${id}/`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Comments']
        })
    })
})

export const {
    useGetCalendarQuery,
    useGetOrderQuery,
    useLazyGetOrderQuery,
    useGetCategoriesQuery,
    useGetAllCategoriesQuery,
    useGetOrdersQuery,
    useGetItemsQuery,
    useGetOrdersItemsQuery,
    usePatchEBMSItemMutation
} = embs
