import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Statuses = () => {
    const [category] = useQueryParam('category', StringParam)
    const [scheduled, setScheduled] = useQueryParam('scheduled', BooleanParam)

    const onValueChange = (tab: string) =>
        setScheduled(tab === 'all' ? undefined : tab === 'scheduled')

    const getDefaultValue = () => {
        switch (scheduled) {
            case false:
                return 'unscheduled'
            case true:
                return 'scheduled'
            default:
                return 'all'
        }
    }

    return (
        <Tabs
            key={category}
            onValueChange={onValueChange}
            defaultValue={getDefaultValue()}>
            <TabsList className='bg-secondary'>
                <TabsTrigger value='all'>All</TabsTrigger>
                <TabsTrigger value='unscheduled'>Unscheduled</TabsTrigger>
                <TabsTrigger value='scheduled'>Scheduled</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
