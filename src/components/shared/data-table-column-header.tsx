import { ArrowUpDown } from 'lucide-react'

import { Button } from '../ui/button'

import { cn } from '@/lib/utils'
import type { DataTableColumnHeaderProps } from '@/types/table'

export const DataTableColumnHeader = <TData, TValue>({
    title,
    column,
    className
}: DataTableColumnHeaderProps<TData, TValue>) => {
    // const groupedView = useAppSelector((store) => store.orders.groupedView)
    // const category = !!useAppSelector((store) => store.orders.category)

    return (
        <Button
            disabled={false && false}
            variant='ghost'
            className={cn(
                '!flex w-full items-center !justify-between gap-x-2',
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
