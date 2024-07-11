import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'

import { Button } from '../ui/button'

import { cn } from '@/lib/utils'
import type { DataTableColumnHeaderProps } from '@/types/table'

export const DataTableColumnHeader = <TData, TValue>({
    title,
    column,
    className
}: DataTableColumnHeaderProps<TData, TValue>) => {
    const [grouped] = useQueryParam('grouped', BooleanParam)
    const [view] = useQueryParam('view', StringParam)

    return (
        <Button
            disabled={grouped!}
            variant='ghost'
            className={cn(
                '!flex w-full items-center !justify-between gap-x-2 px-2',
                className
            )}
            onClick={column.getToggleSortingHandler()}>
            {title}

            {column.getIsSorted() ? (
                column.getIsSorted() === 'asc' ? (
                    <ArrowUp
                        className={cn(
                            'ml-2 h-4 w-4 flex-shrink-0 text-foreground',
                            grouped && view === 'all-details' ? 'hidden' : ''
                        )}
                    />
                ) : (
                    <ArrowDown
                        className={cn(
                            'ml-2 h-4 w-4 flex-shrink-0 text-foreground',
                            grouped && view === 'all-details' ? 'hidden' : ''
                        )}
                    />
                )
            ) : (
                <ArrowUpDown
                    className={cn(
                        'ml-2 h-4 w-4 flex-shrink-0',
                        grouped && view === 'all-details' ? 'hidden' : ''
                    )}
                />
            )}
        </Button>
    )
}
