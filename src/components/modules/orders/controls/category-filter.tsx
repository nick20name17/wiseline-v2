import { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useGetAllCategoriesQuery } from '@/store/api/ebms/ebms'

export const CategoryFilter = () => {
    const [category = 'All', setCategory] = useQueryParam('category', StringParam)

    const { data: categoriesData, isLoading } = useGetAllCategoriesQuery()

    const tabs = categoriesData?.map((category) => category.name)

    const onValueChange = (value: string) => setCategory(value)

    useEffect(() => {
        setCategory(category)
    }, [category])

    return (
        <Select
            key={category}
            defaultValue={category!}
            disabled={isLoading || categoriesData?.length === 0}
            onValueChange={onValueChange}>
            <SelectTrigger
                className={cn(
                    '!w-40 text-left font-medium',
                    category !== 'All' ? 'border-primary text-primary' : ''
                )}>
                <SelectValue placeholder='Select flow' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='All'>All Categories</SelectItem>
                {tabs?.map((category) => (
                    <SelectItem
                        key={category}
                        value={category}>
                        {category}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
