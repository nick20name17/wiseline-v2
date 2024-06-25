import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import type { Matcher } from 'react-day-picker'
import { toast } from 'sonner'
import { StringParam, useQueryParam } from 'use-query-params'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { usePatchEBMSItemMutation } from '@/store/api/ebms/ebms'
import type { EBMSItemPatchData, OrdersData } from '@/store/api/ebms/ebms.types'
import { useGetCompanyProfilesQuery } from '@/store/api/profiles/profiles'
import { isErrorWithMessage } from '@/utils'

interface ShipDatePickerCellProps {
    order: OrdersData
}
export const ShipDatePickerCell: React.FC<ShipDatePickerCellProps> = ({ order }) => {
    const orderId = order?.id
    const shipDate = order?.ship_date

    const [date, setDate] = useState<Date | undefined>(
        shipDate ? new Date(shipDate) : undefined
    )

    const [scheduled] = useQueryParam('scheduled', StringParam)

    const [open, setOpen] = useState(false)
    const [disabledDays, setDisabledDays] = useState<Matcher[]>([])

    const close = () => setOpen(false)

    const [patchSalesOrder] = usePatchEBMSItemMutation()

    const { data: companyProfiles } = useGetCompanyProfilesQuery()

    const successToast = (date: string | null, orderId: string) => {
        const isDateNull = date === null

        const dateMessage = isDateNull
            ? 'Ship date has been reset'
            : `Ship date has been changed to ${date}`

        const scheduledDescription = !isDateNull
            ? dateMessage
            : 'Ship date has been reset.'

        const unscheduledDescription = isDateNull
            ? dateMessage
            : `Ship date has been ${!!date ? 'updated' : 'added'}.`

        const description = scheduled ? scheduledDescription : unscheduledDescription

        toast.success(`Order ${orderId}`, { description })
    }

    const errorToast = (description: string, orderId: string) =>
        toast.error(`Order ${orderId} ship date`, {
            description
        })

    const handlePatchSalesOrder = async (data: EBMSItemPatchData) => {
        try {
            await patchSalesOrder(data)
                .unwrap()
                .then(() => successToast(data.data.ship_date!, orderId))
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(
                isErrorMessage ? error?.data?.detail : 'Something went wrong',
                orderId
            )
        }
    }

    const handleSetDate = () => {
        handlePatchSalesOrder({
            id: orderId!,
            data: {
                ship_date: format(date!, 'yyyy-MM-dd')
            }
        })

        close()
    }

    useEffect(() => {
        if (!companyProfiles?.working_weekend) {
            setDisabledDays([{ dayOfWeek: [0, 6] }])
        }
    }, [companyProfiles?.working_weekend])

    useEffect(() => {
        setDate(shipDate ? new Date(shipDate) : undefined)
    }, [shipDate, orderId])

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={order?.completed}
                    variant='outline'
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                    )}>
                    <CalendarIcon className='mr-2 h-3 w-3 flex-shrink-0' />

                    {date ? format(date, 'dd.MM.yyyy EEE') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                <Calendar
                    disabled={disabledDays}
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
                <div className='flex w-full items-center justify-start gap-x-3 p-3 pt-0'>
                    <Button
                        className='flex-1'
                        onClick={handleSetDate}>
                        Set Date
                    </Button>
                    <Button
                        onClick={close}
                        className='flex-1'
                        variant='secondary'>
                        Cancel
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
