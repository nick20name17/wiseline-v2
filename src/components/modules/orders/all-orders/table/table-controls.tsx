import { useRef } from 'react'

import { CategoryFilter } from '../../controls/category-filter'
import { Filters } from '../../controls/filters'
import { FlowFilter } from '../../controls/flow-filter'
import { StageFilter } from '../../controls/stage-filter'
import { Statuses } from '../../controls/statuses'

import { SearchBar } from '@/components/shared'
import { useIsSticky, useMatchMedia } from '@/hooks'
import { cn } from '@/lib/utils'

export const TableControls = () => {
    const ref = useRef<HTMLDivElement>(null)
    const { isTablet } = useMatchMedia()

    const isSticky = useIsSticky(ref)
    return isTablet ? (
        <>
            <div className='flex flex-wrap items-center justify-between gap-x-4 max-sm:w-full'>
                <Statuses />
                <SearchBar />
            </div>

            <div
                ref={ref}
                className={cn(
                    'sticky left-0 top-0 z-[1000] mb-1 mt-4 flex w-full items-center gap-x-2 px-1 transition-all max-sm:w-full',
                    isSticky ? 'border-b bg-background py-2 shadow-sm' : ''
                )}>
                <CategoryFilter />
                <FlowFilter />
                <StageFilter />
                <Filters />
            </div>
        </>
    ) : (
        <div
            className='flex w-full flex-wrap items-start justify-between gap-x-4 py-2'
            id='order-statuses'>
            <div className='flex flex-wrap items-center justify-between gap-x-4 max-sm:w-full'>
                <Statuses />
                <SearchBar />
            </div>

            <div className='flex items-center gap-x-4'>
                <CategoryFilter />
                <FlowFilter />
                <StageFilter />
                <Filters />
            </div>
        </div>
    )
}
