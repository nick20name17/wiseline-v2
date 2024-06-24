import { X } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export const Filters = () => {
    const [date, setDate] = useQueryParam('date', StringParam)
    const [overdue, setOverdue] = useQueryParam('overdue', BooleanParam)
    const [completed, setCompleted] = useQueryParam('completed', BooleanParam)

    const filters = useMemo(() => {
        const newFilters: string[] = []
        if (overdue) newFilters.push('overdue')
        if (completed) newFilters.push('completed')
        return newFilters
    }, [overdue, completed])

    const removeFilter = (filter: string) => {
        if (filter === 'overdue') setOverdue(null)
        if (filter === 'completed') setCompleted(null)
    }

    useEffect(() => {
        if (overdue && date) {
            setDate(null)
        }
    }, [overdue, date])

    useEffect(() => {
        setOverdue(overdue)
        setCompleted(completed)
    }, [completed, overdue])

    return (
        <div className='flex items-center gap-5'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className='h-[45px]'
                        variant='outline'>
                        Filters
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuCheckboxItem
                        checked={overdue!}
                        onCheckedChange={setOverdue}>
                        Overdue
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={completed!}
                        onCheckedChange={setCompleted}>
                        Completed
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex items-center gap-2'>
                {filters.map((filter) => (
                    <Badge
                        variant='outline'
                        className='cursor-pointer capitalize hover:border-destructive hover:text-destructive'
                        key={filter}
                        onClick={() => removeFilter(filter)}>
                        {filter}
                        <X className='ml-1 h-3 w-3 font-bold' />
                    </Badge>
                ))}
            </div>
        </div>
    )
}
