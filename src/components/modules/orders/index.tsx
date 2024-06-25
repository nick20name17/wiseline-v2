import { useQueryParam } from 'use-query-params'

import { AllOrders } from './all-orders'
import { Items } from './items'

export const Orders = () => {
    const [category] = useQueryParam('category')

    return category === 'All' ? <AllOrders /> : <Items />
}
