import type { CategoriesData } from '../ebms/ebms.types'
import type { UsersProfileData } from '../profiles/profiles.types'

import type { PatchData, Response } from '@/types/api'

export type UserRoles = 'admin' | 'worker' | 'manager' | 'client'

export interface UserData {
    id: number
    email: string
    is_active: boolean
    is_superuser: boolean
    is_verified: boolean
    first_name: string
    last_name: string
    role: UserRoles
    category: CategoriesData[]
    user_profiles: null | UsersProfileData[]
}

export interface UsersAddData {
    email: string
    first_name: string
    last_name: string
    role: UserRoles
    category?: number[]
}

export interface UserComment extends Omit<UserData, 'role' | 'category'> {}

export interface UserAllQueryParams {
    first_name: string
    last_name: string
    email: string
    role: UserRoles
    is_active: boolean
    ordering: string
    search: string
}

export type UsersPatchData = PatchData<UsersAddData>

export type UsersResponse = Response<UserData>
