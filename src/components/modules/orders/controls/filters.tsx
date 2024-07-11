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
import { Separator } from '@/components/ui/separator'

export const Filters = () => {
    const [date, setDate] = useQueryParam('date', StringParam)
    const [overdue, setOverdue] = useQueryParam('overdue', BooleanParam)
    const [completed, setCompleted] = useQueryParam('completed', BooleanParam)
    const [scheduled] = useQueryParam('scheduled', BooleanParam)

    const filters = useMemo(() => {
        const newFilters: string[] = []
        if (overdue) newFilters.push('overdue')
        if (completed) newFilters.push('completed')
        return newFilters
    }, [overdue, completed])

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    className='max-w-[170px]'>
                    Filters
                    {filters?.length ? (
                        <>
                            <Separator
                                orientation='vertical'
                                className='mx-2'
                            />
                            <Badge className='pointer-events-none max-w-[82px]'>
                                {filters?.length} Selected
                            </Badge>
                        </>
                    ) : null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                {scheduled === false ? null : (
                    <DropdownMenuCheckboxItem
                        checked={overdue!}
                        onCheckedChange={setOverdue}>
                        Overdue
                    </DropdownMenuCheckboxItem>
                )}
                <DropdownMenuCheckboxItem
                    checked={completed!}
                    onCheckedChange={setCompleted}>
                    Completed
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
