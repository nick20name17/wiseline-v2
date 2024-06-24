import { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetAllCategoriesQuery } from '@/store/api/ebms/ebms'

export const ProductionCategories = () => {
    const [category = 'All', setCategory] = useQueryParam('category', StringParam)

    const { data, isLoading } = useGetAllCategoriesQuery()

    const onValueChange = (tab: string) => setCategory(tab)

    const tabs = data?.map((category) => category.name)
    tabs?.unshift('All')

    // useEffect(() => {
    // const currentCategory = data?.find(
    //     (dataCategory) => dataCategory.name === productionCategory
    // )

    // const { capacity, total_capacity } = currentCategory || {
    //     capacity: 0,
    //     total_capacity: 0
    // }

    // dispatch(setCurrentCapacity({ capacity, total_capacity }))
    // }, [data, productionCategory])

    useEffect(() => {
        setCategory(category)
    }, [category])

    return (
        <div className='flex flex-wrap items-start justify-between gap-x-6'>
            <Tabs
                onValueChange={onValueChange}
                defaultValue={category!}
                className='w-fit py-3'>
                {isLoading ? (
                    <Skeleton className='h-10 w-[427px]' />
                ) : (
                    <TabsList className='h-[43px] bg-secondary'>
                        {tabs?.map((tab) => (
                            <TabsTrigger
                                value={tab}
                                key={tab}>
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                )}
            </Tabs>
        </div>
    )
}
