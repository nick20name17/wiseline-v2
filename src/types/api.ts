export interface Response<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export interface PatchData<T> {
    id: number | string
    data: Partial<T>
}

export interface BaseQueryParams {
    offset: number
    limit: number
}

type Orderable<T extends string> = T | `-${T}`

export type OrderableNames<T extends string> = Orderable<T>
