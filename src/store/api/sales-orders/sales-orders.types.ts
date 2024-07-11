import type { PrioritiesData } from '../priorities/priorities.types'

import type { PatchData, Response } from '@/types/api'

export interface SalesOrdersData {
    id: number
    order: string
    priority: PrioritiesData
    packages: number
    location: number
    production_date: string | null
}

export type SalesOrdersAddData = Partial<
    Omit<
        {
            order: string
            priority: number
            packages: number
            location: number
            production_date: string | null
        },
        'id'
    >
>

export type SalesOrdersPatchData = PatchData<{
    order: string
    priority: number | null
    packages: number | null
    location: number | null
    production_date: string | null
}>

export type SalesOrdersResponse = Response<SalesOrdersData>
