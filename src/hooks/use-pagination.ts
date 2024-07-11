import { useState } from 'react'
import { NumberParam, useQueryParam } from 'use-query-params'

import { tableConfig } from '@/config/table'

export const usePagination = () => {
    const [offsetParam] = useQueryParam('offset', NumberParam)
    const [limitParam] = useQueryParam('limit', NumberParam)

    const [pagination, setPagination] = useState({
        pageSize: limitParam || tableConfig.pagination.pageSize,
        pageIndex: offsetParam! / (limitParam || tableConfig.pagination.pageIndex) || 0
    })

    const { pageSize, pageIndex } = pagination
    const offset = pageIndex * pageSize!

    return {
        limit: pageSize,
        setPagination,
        offset
    }
}
