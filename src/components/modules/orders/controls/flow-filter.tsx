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
import { useGetFlowsQuery } from '@/store/api/flows/flows'

export const FlowFilter = () => {
    const [category] = useQueryParam('category', StringParam)
    const [flow, setFlowId] = useQueryParam('flow', StringParam)

    const onValueChange = (value: string) => {
        if (value === 'all') {
            setFlowId(null)

            return
        } else {
            setFlowId(value)
        }
    }

    const {
        data: flowsData,
        isFetching,
        isLoading
    } = useGetFlowsQuery({
        category__prod_type: category!
    })

    useEffect(() => {
        setFlowId(flow)

        return () => {
            setFlowId(null)
        }
    }, [flow])

    useEffect(() => {
        setFlowId(null)
    }, [category])

    return (
        <Select
            key={flow! + category}
            defaultValue={flow || 'all'}
            disabled={isLoading || isFetching || !flowsData?.results?.length}
            onValueChange={onValueChange}>
            <SelectTrigger
                className={cn(
                    '!w-40 text-left font-medium',
                    flow ? 'border-primary text-primary' : ''
                )}>
                <SelectValue placeholder='Select flow' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    key='all'
                    value='all'>
                    All flows
                </SelectItem>
                {flowsData?.results?.map((flow) => (
                    <SelectItem
                        key={flow.id}
                        value={String(flow.id)}>
                        {flow.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
