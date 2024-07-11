import type { PatchData } from '@/types/api'

export interface PrioritiesData {
    name: string
    color: string
    position: number
    id: number
}

export type PrioritiesAddData = Omit<PrioritiesData, 'id'>

export type PrioritiesPatchData = PatchData<PrioritiesAddData>
