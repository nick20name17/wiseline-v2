import { api } from '..'

import type {
    UserAllQueryParams,
    UserData,
    UsersAddData,
    UsersPatchData
} from './users.types'

export const users = api.injectEndpoints({
    endpoints: (build) => ({
        getAllUsers: build.query<UserData[], Partial<UserAllQueryParams>>({
            query: () => 'users/all/',
            providesTags: ['Users']
        }),
        getUser: build.query<UserData, number>({
            query: (id) => `users/${id}/`,
            providesTags: ['Users']
        }),
        addUser: build.mutation<void, UsersAddData>({
            query: (data) => ({
                url: `users/`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Users']
        }),
        patchUser: build.mutation<void, UsersPatchData>({
            query: ({ data, id }) => ({
                url: `users/${id}/`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Users']
        }),
        removeUser: build.mutation<void, number>({
            query: (id) => ({
                url: `users/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Users']
        })
    })
})

export const {
    useGetAllUsersQuery,
    useGetUserQuery,
    useAddUserMutation,
    usePatchUserMutation,
    useRemoveUserMutation
} = users
