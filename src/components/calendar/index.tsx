import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    isWeekend,
    parse,
    startOfToday,
    startOfWeek
} from 'date-fns'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

import { Categories } from './categories'
import { cn } from '@/lib/utils'
import { useGetCalendarQuery } from '@/store/api/ebms/ebms'
import type {
    CalendarResponse,
    CapacityKey,
    DailyDataCategory
} from '@/store/api/ebms/ebms.types'
import { useGetCompanyProfilesQuery } from '@/store/api/profiles/profiles'

export const Calendar = () => {
    const today = startOfToday()

    // Initialize query params
    const [category = 'Rollforming'] = useQueryParam('category', StringParam)
    const [monthQuery, setMonthQuery] = useQueryParam('month', StringParam)
    const [yearQuery, setYearQuery] = useQueryParam('year', StringParam)

    // Initialize currentDate state based on query params or default to today
    const initialDate =
        monthQuery && yearQuery
            ? parse(`${yearQuery} ${monthQuery}`, 'yyyy M', new Date())
            : today
    const [currentDate, setCurrentDate] = useState(format(initialDate, 'MMM yyyy'))

    const firstDayCurrentMonth = parse(currentDate, 'MMM yyyy', new Date())

    useEffect(() => {
        if (monthQuery && yearQuery) {
            const dateFromQuery = parse(
                `${yearQuery} ${monthQuery}`,
                'yyyy M',
                new Date()
            )
            setCurrentDate(format(dateFromQuery, 'MMM yyyy'))
        } else {
            const firstDayCurrentMonth = parse(currentDate, 'MMM yyyy', new Date())
            setMonthQuery(format(firstDayCurrentMonth, 'M'))
            setYearQuery(format(firstDayCurrentMonth, 'yyyy'))
        }
    }, [monthQuery, yearQuery])

    const getNextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentDate(format(firstDayNextMonth, 'MMM yyyy'))
        setMonthQuery(format(firstDayNextMonth, 'M'))
        setYearQuery(format(firstDayNextMonth, 'yyyy'))
    }

    const getPreviousMonth = () => {
        const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentDate(format(firstDayPreviousMonth, 'MMM yyyy'))
        setMonthQuery(format(firstDayPreviousMonth, 'M'))
        setYearQuery(format(firstDayPreviousMonth, 'yyyy'))
    }

    const getCurrentMonthDays = () => {
        return eachDayOfInterval({
            start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 0 }),
            end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 0 })
        })
    }

    const { data: calendarData, isFetching } = useGetCalendarQuery({
        month: +format(firstDayCurrentMonth, 'M'),
        year: +format(firstDayCurrentMonth, 'yyyy')
    })

    useEffect(() => {
        setMonthQuery(format(firstDayCurrentMonth, 'M'))
        setYearQuery(format(firstDayCurrentMonth, 'yyyy'))
    }, [currentDate])

    return (
        <>
            <div className='flex flex-wrap-reverse items-center justify-between gap-4 px-3 py-3'>
                <Categories />
                <div className='flex w-[218px] items-center justify-between gap-x-4 max-[440px]:w-full'>
                    <Button
                        onClick={getPreviousMonth}
                        variant='outline'
                        className='h-8 w-8 p-0'>
                        <ArrowLeft className='h-4 w-4' />
                    </Button>

                    <h1 className='scroll-m-20 font-bold'>
                        {format(firstDayCurrentMonth, 'MMM yyyy')}
                    </h1>

                    <Button
                        onClick={getNextMonth}
                        variant='outline'
                        className='h-8 w-8 p-0'>
                        <ArrowRight className='h-4 w-4' />
                    </Button>
                </div>
            </div>

            <div className='!w-full overflow-x-auto'>
                <Weeks />
                <Body
                    category={category as CapacityKey}
                    caledarData={calendarData!}
                    isFetching={isFetching}
                    currentDays={getCurrentMonthDays()}
                    firstDayCurrentMonth={firstDayCurrentMonth}
                />
            </div>
        </>
    )
}

const Day = ({
    date,
    firstDayCurrentMonth,
    caledarData,
    isFetching,
    category
}: {
    date: Date
    firstDayCurrentMonth: Date
    caledarData: CalendarResponse
    isFetching: boolean
    category: CapacityKey
}) => {
    const isDisabled = isWeekend(date)

    const { data } = useGetCompanyProfilesQuery()
    const isWorkingWeekend = data?.working_weekend

    const currentDate = format(date, 'yyyy-MM-dd')

    const capacity = caledarData?.[currentDate]?.[category]!
    const totalCapacity = caledarData?.capacity_data?.[category]!

    return (
        <div
            className={cn(
                'flex min-w-[187px] flex-1 flex-col justify-between gap-y-2 rounded-sm border p-3',
                isToday(date) && 'border-primary',

                !isSameMonth(date, firstDayCurrentMonth) && 'opacity-50'
            )}>
            <span
                className={cn(
                    'self-end',
                    isToday(date) &&
                        'flex h-8 w-8 items-center justify-center rounded-full bg-primary text-background'
                )}>
                {format(date, 'd')}
            </span>
            {isDisabled && !isWorkingWeekend ? (
                ''
            ) : isFetching ? (
                <Skeleton className='h-8 w-full' />
            ) : (
                <Capacity
                    dailyData={capacity}
                    totalCapacity={totalCapacity}
                />
            )}
        </div>
    )
}

const Body = ({
    currentDays,
    firstDayCurrentMonth,
    caledarData,
    isFetching,
    category
}: {
    currentDays: Date[]
    caledarData: CalendarResponse
    isFetching: boolean
    firstDayCurrentMonth: Date
    category: CapacityKey
}) => {
    return (
        <div className='grid grid-cols-[repeat(7,1fr)] gap-2 px-3'>
            {currentDays.map((currentDate) => (
                <Day
                    category={category}
                    caledarData={caledarData}
                    isFetching={isFetching}
                    date={currentDate}
                    key={currentDate.toString()}
                    firstDayCurrentMonth={firstDayCurrentMonth}
                />
            ))}
        </div>
    )
}

const Weeks = () => {
    return (
        <div className='grid grid-cols-[repeat(7,1fr)] gap-2 px-3'>
            <div className='min-w-[187px] p-4 text-center'>Sunday</div>
            <div className='min-w-[187px] p-4 text-center'>Monday</div>
            <div className='min-w-[187px] p-4 text-center'>Tuesday</div>
            <div className='min-w-[187px] p-4 text-center'>Wednesday</div>
            <div className='min-w-[187px] p-4 text-center'>Thursday</div>
            <div className='min-w-[187px] p-4 text-center'>Friday</div>
            <div className='min-w-[187px] p-4 text-center'>Saturday</div>
        </div>
    )
}

const Capacity = ({
    dailyData,
    totalCapacity
}: {
    dailyData: DailyDataCategory
    totalCapacity: number
}) => {
    return (
        <div className='text-sm'>
            <div className='mx-auto flex h-8 items-center justify-between gap-x-2 rounded-md border bg-muted/40 px-2'>
                <Badge
                    className='pointer-events-none'
                    variant={dailyData?.count_orders ? 'default' : 'outline'}>
                    {dailyData?.count_orders ?? '0'}
                </Badge>
                {dailyData?.count_orders ?? '0'} / {totalCapacity}
            </div>
        </div>
    )
}
