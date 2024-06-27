import { ArrowUpDown } from 'lucide-react'
import { BooleanParam, useQueryParam } from 'use-query-params'

import { Button } from '../ui/button'

import { cn } from '@/lib/utils'
import type { DataTableColumnHeaderProps } from '@/types/table'

export const DataTableColumnHeader = <TData, TValue>({
    title,
    column,
    className
}: DataTableColumnHeaderProps<TData, TValue>) => {
    const [groupedView] = useQueryParam('grouped', BooleanParam)

    return (
        <Button
            disabled={groupedView!}
            variant='ghost'
            className={cn(
                '!flex w-full items-center !justify-between gap-x-2 px-2',
                className
            )}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {title}
            <ArrowUpDown
                className={cn('h-4 w-4 flex-shrink-0', false && false ? 'opacity-0' : '')}
            />
        </Button>
    )
}
