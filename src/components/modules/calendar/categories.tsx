import { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetCategoriesQuery } from '@/store/api/ebms/ebms'

export const Categories = () => {
    const { data: categoriesData, isLoading } = useGetCategoriesQuery({})

    const [category = 'Rollforming', setCategory] = useQueryParam('category', StringParam)

    const filteredCategories = categoriesData?.results?.filter(
        (category) => category.name == 'Rollforming' || category.name === 'Trim'
    )

    const onValueChange = (value: string) => setCategory(value)

    useEffect(() => {
        setCategory(category)
    }, [category])

    return (
        <Tabs
            onValueChange={onValueChange}
            defaultValue={category!}>
            {isLoading ? (
                <Skeleton className='h-10 w-40' />
            ) : (
                <TabsList className='bg-secondary'>
                    {filteredCategories?.map((tab) => (
                        <TabsTrigger
                            className='flex-1'
                            value={tab.name}
                            key={tab.name}>
                            {tab.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            )}
        </Tabs>
    )
}
