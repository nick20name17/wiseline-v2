import type { RootState } from '..'
import {
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react'

import { logout, tokenUpdated } from '../slices/auth'

import { apiBaseUrl } from '@/config/app'
import type {
    AccessToken,
    LoginData,
    LoginResponse,
    RefreshResponse,
    RefreshToken,
    UserData
} from '@/types/auth'

const baseQuery = fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
        const getAccessToken = () => {
            const stateToken = (getState() as RootState).auth.access
            const tokenFromStorage = localStorage.getItem('token')

            const parsedToken = tokenFromStorage
                ? (JSON.parse(tokenFromStorage) as AccessToken)?.access
                : null

            return stateToken || parsedToken
        }

        const token = getAccessToken()

        if (token && token !== null) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        const token = localStorage.getItem('token')
        const refresh = token !== null ? (JSON.parse(token) as RefreshToken)?.refresh : ''

        const content = JSON.stringify({ refresh })

        const refreshResult = (await baseQuery(
            {
                url: 'token/refresh/',
                method: 'POST',
                body: content,
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            api,
            extraOptions
        )) as RefreshResponse

        if (refreshResult?.data) {
            const { access } = refreshResult?.data
            api.dispatch(tokenUpdated({ access }))

            localStorage.setItem('token', JSON.stringify({ access, refresh }))

            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }

    return result
}
export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        login: build.mutation<LoginResponse, LoginData>({
            query: (body) => ({
                url: 'token/',
                method: 'POST',
                body
            })
        }),
        getUser: build.query<UserData, void>({
            query: () => 'user-info/',
            providesTags: ['User']
        })
    }),
    tagTypes: ['User', 'TimeEntries']
})

export const {
    useLoginMutation,
    useGetUserQuery,
    endpoints: { login, getUser }
} = api
