import { format } from 'date-fns'
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import type { Matcher } from 'react-day-picker'
import { toast } from 'sonner'
import { StringParam, useQueryParam } from 'use-query-params'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { OrdersData } from '@/store/api/ebms/ebms.types'
import { useGetCompanyProfilesQuery } from '@/store/api/profiles/profiles'
import {
    useAddSalesOrderMutation,
    usePatchSalesOrderMutation
} from '@/store/api/sales-orders/sales-orders'
import type {
    SalesOrdersAddData,
    SalesOrdersPatchData
} from '@/store/api/sales-orders/sales-orders.types'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface OrderDatePickerCellProps {
    order: OrdersData
}
export const OrderDatePickerCell: React.FC<OrderDatePickerCellProps> = ({ order }) => {
    const productionDate = order.sales_order?.production_date
    const [date, setDate] = useState<Date | undefined>(
        productionDate ? new Date(productionDate) : undefined
    )

    const salesOrderId = order.sales_order?.id
    const orderId = order.id

    const [scheduled] = useQueryParam('scheduled', StringParam)

    const [open, setOpen] = useState(false)

    const { data: companyProfiles } = useGetCompanyProfilesQuery()

    const [patchSalesOrder] = usePatchSalesOrderMutation()
    const [addSalesOrder] = useAddSalesOrderMutation()

    const close = () => setOpen(false)

    const successToast = (date: string | null, orderId: string) => {
        const isDateNull = date === null

        const dateMessage = isDateNull
            ? 'Production date has been reset'
            : `Production date has been changed to ${date}`

        const scheduledDescription = !isDateNull
            ? dateMessage
            : 'Production date has been reset. Order moved to Unscheduled'

        const unscheduledDescription = isDateNull
            ? dateMessage
            : `Production date has been ${
                  salesOrderId ? 'updated' : 'added'
              }. Order moved to Scheduled`

        const description = scheduled ? scheduledDescription : unscheduledDescription

        toast.success(`Order ${orderId}`, { description })
    }

    const errorToast = (description: string, orderId: string) =>
        toast.error(`Order ${orderId}`, {
            description
        })

    const handlePatchSalesOrder = async (data: SalesOrdersPatchData) => {
        try {
            await patchSalesOrder(data)
                .unwrap()
                .then(() => successToast(data.data.production_date!, orderId))
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(
                isErrorMessage ? error.data.detail : 'Something went wrong',
                orderId
            )
        }
    }

    const handleAddSalesOrder = async (data: SalesOrdersAddData) => {
        try {
            await addSalesOrder(data)
                .unwrap()
                .then((data2) => {
                    console.log(data2)

                    successToast(data.production_date!, orderId)
                })
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)

            errorToast(
                isErrorMessage ? error.data.detail : 'Something went wrong',
                orderId
            )
        }
    }

    const handleSetDate = () => {
        const productionDate = format(date!, 'yyyy-MM-dd')

        const data = {
            production_date: productionDate,
            order: orderId
        }

        if (!salesOrderId) {
            handleAddSalesOrder(data)
        } else {
            handlePatchSalesOrder({
                id: salesOrderId!,
                data
            })
        }

        close()
    }

    const handleResetDate = () => {
        handlePatchSalesOrder({
            id: salesOrderId!,
            data: {
                production_date: null,
                order: orderId
            }
        })

        setDate(undefined)
        close()
    }

    const [disabledDays, setDisabledDays] = useState<Matcher[]>([])

    useEffect(() => {
        if (!companyProfiles?.working_weekend) {
            setDisabledDays([{ dayOfWeek: [0, 6] }])
        }
    }, [companyProfiles?.working_weekend])

    useEffect(() => {
        setDate(productionDate ? new Date(productionDate) : undefined)
    }, [productionDate, order?.id])

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={order?.completed}
                    variant='outline'
                    className={cn(
                        'w-40 justify-start text-left font-normal',
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
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    disabled={!productionDate}
                                    onClick={handleResetDate}
                                    size='icon'
                                    variant='destructive'>
                                    <RotateCcw className='h-4 w-4' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Reset date</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </PopoverContent>
        </Popover>
    )
}
