import { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useGetStagesQuery } from '@/store/api/stages/stages'

export const StageFilter = () => {
    const [stage, setStage] = useQueryParam('stage', StringParam)
    const [flow] = useQueryParam('flow', StringParam)
    const [category] = useQueryParam('category', StringParam)

    const onValueChange = (value: string) => {
        if (value === 'all') {
            setStage(null)
        } else {
            setStage(value)
        }
    }

    const {
        data: stages,
        isLoading,
        isFetching
    } = useGetStagesQuery({
        flow: flow ? +flow! : null
    })

    useEffect(() => {
        if (flow) {
            setStage(stage)
        } else {
            setStage(null)
        }
    }, [stage])

    useEffect(() => {
        if (category === 'All' || !flow) {
            setStage(null)
        }
    }, [category, flow])

    return category && flow ? (
        <Select
            // key={stage + category}
            defaultValue={stage! || 'all'}
            disabled={isLoading || isFetching || !stages?.results?.length}
            onValueChange={onValueChange}>
            <SelectTrigger
                className={cn(
                    '!w-40 text-left font-medium',
                    stage ? 'border-primary text-primary' : ''
                )}>
                <SelectValue placeholder='Select Stage' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    key='all'
                    value='all'>
                    All Stages
                </SelectItem>
                {stages?.results?.map((flow) => (
                    <SelectItem
                        key={flow.id}
                        value={String(flow.id)}>
                        {flow.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    ) : null
}
