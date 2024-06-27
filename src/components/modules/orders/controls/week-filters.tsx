import { useEffect } from 'react'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'

import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useGetCategoriesQuery } from '@/store/api/ebms/ebms'
import { useGetCompanyProfilesQuery } from '@/store/api/profiles/profiles'
import { getWorkDays } from '@/utils'
import type { FormattedDate } from '@/utils/get-work-days'

export const WeekFilters = () => {
    const [category] = useQueryParam('category', StringParam)
    const [_, setOverdue] = useQueryParam('overdue', BooleanParam)
    const [scheduled, setScheduled] = useQueryParam('scheduled', BooleanParam)
    const [date, setDate] = useQueryParam('date', StringParam)

    const { data } = useGetCompanyProfilesQuery()

    const workingDays = getWorkDays(data?.working_weekend)

    const onValueChange = (value: string) => {
        if (!scheduled) {
            setScheduled(true)
        }

        setDate(value || null)
        setOverdue(null)
    }

    useEffect(() => {
        if (!scheduled || category === 'All') {
            setDate(null)
        } else {
            // setDate(date || workingDays[0].date || null)
        }
    }, [scheduled, date])

    return category !== 'All' && scheduled !== undefined ? (
        <div className='flex items-center gap-x-1 gap-y-10 overflow-x-scroll p-0.5 max-[1118px]:w-full'>
            <ToggleGroup
                key={date!}
                defaultValue={date!}
                onValueChange={onValueChange}
                type='single'>
                {workingDays.map((date) => (
                    <WeekFilter
                        key={date.date}
                        {...date}
                    />
                ))}
            </ToggleGroup>
        </div>
    ) : null
}

const WeekFilter: React.FC<FormattedDate> = ({ date, dateToDisplay }) => {
    const [category] = useQueryParam('category', StringParam)

    const { data, isLoading } = useGetCategoriesQuery({
        production_date: date
    })

    const currentCategory = data?.results?.find(
        (dataCategory) => dataCategory.name === category
    )

    const { capacity, total_capacity } = currentCategory || {}

    const currentPercentage = ((total_capacity ?? 0) / capacity!) * 100 || 0

    const colors = {
        green: 'bg-green-500',
        red: 'bg-red-500',
        yellow: 'bg-yellow-500'
    } as const

    const getCurrentColor = (currentPercentage: number) => {
        if (currentPercentage >= 0 && currentPercentage < 50) {
            return colors.green
        } else if (currentPercentage >= 50 && currentPercentage < 80) {
            return colors.yellow
        } else if (currentPercentage > 80) {
            return colors.red
        }
    }

    const currentColorClass = getCurrentColor(currentPercentage)

    return (
        <ToggleGroupItem
            value={date}
            className='data-[state=on]:shadow-custom data-[state=on]: flex h-[41px] w-[176px] flex-col gap-0.5 bg-secondary px-1 py-2 text-[13px] text-secondary-foreground shadow-foreground -outline-offset-1 data-[state=on]:outline data-[state=on]:outline-1 data-[state=on]:outline-foreground max-[1118px]:flex-1'>
            {isLoading ? (
                <Skeleton className='h-5 w-full' />
            ) : (
                <span className='font-medium'>
                    {dateToDisplay}{' '}
                    {category === 'Rollforming' || category === 'Trim' ? (
                        <>
                            ({total_capacity ?? '0'} / {capacity})
                        </>
                    ) : null}
                </span>
            )}

            {category === 'Rollforming' || category === 'Trim' ? (
                <Progress
                    indicatorClassName={currentColorClass}
                    className='h-1.5 bg-neutral-200'
                    value={currentPercentage > 100 ? 100 : currentPercentage}
                />
            ) : null}
        </ToggleGroupItem>
    )
}
