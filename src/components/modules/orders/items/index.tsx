import type { SortingState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { BooleanParam, NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { columns } from './table/columns'
import { ItemsTable } from './table/table'
import { useCurrentValue, useWebSocket } from '@/hooks'
import { useGetItemsQuery } from '@/store/api/ebms/ebms'
import type { EBMSItemsQueryParams } from '@/store/api/ebms/ebms.types'

export const Items = () => {
    const [overdue] = useQueryParam('overdue', BooleanParam)
    const [completed] = useQueryParam('completed', BooleanParam)
    const [scheduled] = useQueryParam('scheduled', BooleanParam)
    const [searchTerm] = useQueryParam('search', StringParam)
    const [offsetParam] = useQueryParam('offset', NumberParam)
    const [limitParam] = useQueryParam('limit', NumberParam)
    const [date] = useQueryParam('date', StringParam)
    const [flowId] = useQueryParam('flow', StringParam)
    const [category] = useQueryParam('category', StringParam)
    const [grouped] = useQueryParam('grouped', StringParam)
    const [orderingTerm, setOrderingTerm] = useQueryParam('ordering', StringParam)

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: orderingTerm?.replace(/^-/, '')! || 'order',
            desc: orderingTerm?.startsWith('-')! || false
        }
    ])

    useEffect(() => {
        setOrderingTerm(sorting[0]?.desc ? `-${sorting[0]?.id}` : sorting[0]?.id)
    }, [sorting])

    useEffect(() => {
        if (grouped) {
            setSorting([{ id: 'order', desc: false }])
        }
    }, [grouped])

    const currentSortingTerm = sorting[0]?.desc ? `-${sorting[0]?.id}` : sorting[0]?.id

    const queryParams: Partial<EBMSItemsQueryParams> = {
        offset: offsetParam!,
        limit: limitParam!,
        ordering: currentSortingTerm,
        search: searchTerm!,
        flow_id: flowId!,
        is_scheduled: scheduled!,
        category: category!,
        completed: completed!,
        over_due: overdue!
    }

    if (date) {
        queryParams.production_date = date
    }

    const { currentData, isLoading, isFetching, refetch } = useGetItemsQuery(queryParams)

    const dataCount = useCurrentValue(currentData?.count)

    const { dataToRender } = useWebSocket({
        currentData: currentData!,
        endpoint: 'items',
        refetch
    })

    return (
        <ItemsTable
            columns={columns}
            dataCount={dataCount || 0}
            data={dataToRender}
            setSorting={setSorting}
            sorting={sorting}
            isLoading={isLoading}
            isFetching={isFetching}
        />
    )
}
