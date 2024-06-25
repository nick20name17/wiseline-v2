import { useState } from 'react'
import { NumberParam, useQueryParam } from 'use-query-params'

export const usePagination = () => {
    const [offsetParam] = useQueryParam('offset', NumberParam)
    const [limitParam] = useQueryParam('limit', NumberParam)

    const [pagination, setPagination] = useState({
        pageSize: limitParam || 10,
        pageIndex: offsetParam! / (limitParam || 10) || 0
    })

    const { pageSize, pageIndex } = pagination
    const offset = pageIndex * pageSize!

    return {
        limit: pageSize,
        setPagination,
        offset
    }
}
