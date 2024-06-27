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
    const [orderingTerm, setOrderingTerm] = useQueryParam('ordering', StringParam)

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: orderingTerm?.replace(/^-/, '')! || 'invoice',
            desc: orderingTerm?.startsWith('-')! || false
        }
    ])

    useEffect(() => {
        setOrderingTerm(sorting[0]?.desc ? `-${sorting[0]?.id}` : sorting[0]?.id)
    }, [sorting])

    const queryParams: Partial<OrdersQueryParams> = {
        limit: limitParam!,
        offset: offsetParam!,
        is_scheduled: scheduled,
        ordering: orderingTerm!,
        search: searchTerm,
        completed: completed,
        over_due: overdue!
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
