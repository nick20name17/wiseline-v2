import type { SortingState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { BooleanParam, NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { columns } from './table/columns'
import { OrdersTable } from './table/table'
import { useCurrentValue, useWebSocket } from '@/hooks'
import { useGetOrdersQuery } from '@/store/api/ebms/ebms'
import type { OrdersQueryParams } from '@/store/api/ebms/ebms.types'

export const AllOrders = () => {
    const [overdue] = useQueryParam('overdue', BooleanParam)
    const [completed] = useQueryParam('completed', BooleanParam)
    const [scheduled] = useQueryParam('scheduled', BooleanParam)
    const [searchTerm] = useQueryParam('search', StringParam)
    const [offsetParam] = useQueryParam('offset', NumberParam)
    const [limitParam] = useQueryParam('limit', NumberParam)
    const [stage] = useQueryParam('stage', StringParam)
    const [flow] = useQueryParam('flow', StringParam)
    const [orderingTerm, setOrderingTerm] = useQueryParam('ordering', StringParam)

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'priority',
            desc: true
        }
        // {
        //     id: 'invoice',
        //     desc: false
        // }
    ])

    useEffect(() => {
        const currentSortingTerms = sorting
            ?.map((sort) => (sort.desc ? `-${sort.id}` : sort.id))
            .join(',')
        setOrderingTerm(currentSortingTerms || null)
    }, [sorting])

    const queryParams: Partial<OrdersQueryParams> = {
        limit: limitParam!,
        offset: offsetParam!,
        is_scheduled: scheduled,
        ordering: orderingTerm!,
        search: searchTerm,
        completed: completed,
        over_due: overdue!,
        stage_id: stage ? +stage! : null,
        flow_id: flow ? +flow! : null
    }

    const { currentData, isLoading, isFetching, refetch } = useGetOrdersQuery(queryParams)

    const { dataToRender } = useWebSocket({
        currentData: currentData!,
        endpoint: 'orders',
        refetch
    })

    const dataCount = useCurrentValue(currentData?.count)

    return (
        <OrdersTable
            dataCount={dataCount || 0}
            data={dataToRender}
            columns={columns}
            setSorting={setSorting}
            sorting={sorting}
            isLoading={isLoading}
            isFetching={isFetching}
        />
    )
}
