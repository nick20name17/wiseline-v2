import { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const ProductionView = () => {
    const [view = 'all-orders', setView] = useQueryParam('view', StringParam)
    const onValueChange = (value: string) => setView(value)

    useEffect(() => {
        setView(view)
    }, [view])

    return (
        <Tabs
            onValueChange={onValueChange}
            defaultValue={view!}>
            <TabsList className='h-[43px] bg-secondary'>
                <TabsTrigger value='all-orders'>All Orders</TabsTrigger>
                <TabsTrigger value='all-details'>All Lines</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
