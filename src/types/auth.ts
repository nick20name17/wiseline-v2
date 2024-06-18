import type { FetchBaseQueryMeta } from '@reduxjs/toolkit/query'

export interface AccessToken {
    access: string
}

export interface RefreshToken {
    refresh: string
}

export interface LoginData {
    email: string
    password: string
}

export interface UserData {
    id: number
    email: string
    is_staff: boolean
    role: 'admin' | 'accountant' | 'manager' | 'employee'
}

export interface LoginResponse {
    access: string | null
    refresh: string | null
    user: UserData | null
}

export interface RefreshResponse {
    data: AccessToken
    meta: FetchBaseQueryMeta
}
