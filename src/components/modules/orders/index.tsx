import { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import { AllOrders } from './all-orders'
import { Items } from './items'
import { useMatchMedia } from '@/hooks'

export const Orders = () => {
    const [view] = useQueryParam('view', StringParam)

    const { isTablet } = useMatchMedia()

    useEffect(() => {
        if (!isTablet) {
            document.body.style.overflowY = 'hidden'
        }

        return () => {
            document.body.style.overflowY = ''
        }
    }, [isTablet])

    return view === 'all-orders' ? <AllOrders /> : <Items />
}
