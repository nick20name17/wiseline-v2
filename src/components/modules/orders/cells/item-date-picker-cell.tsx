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
import type { EBMSItemsData } from '@/store/api/ebms/ebms.types'
import { useAddItemMutation, usePatchItemMutation } from '@/store/api/items/items'
import type { ItemsAddData, ItemsPatchData } from '@/store/api/items/items.types'
import { useGetCompanyProfilesQuery } from '@/store/api/profiles/profiles'
import { isErrorWithMessage } from '@/utils'

interface ItemDatePickerCellProps {
    originItem: EBMSItemsData
}

export const ItemDatePickerCell: React.FC<ItemDatePickerCellProps> = ({ originItem }) => {
    const productionDate = originItem?.item?.production_date

    const [date, setDate] = useState<Date | undefined>(
        productionDate ? new Date(productionDate) : undefined
    )

    const [scheduled] = useQueryParam('scheduled', StringParam)
    const [category] = useQueryParam('category', StringParam)

    const [open, setOpen] = useState(false)
    const [disabledDays, setDisabledDays] = useState<Matcher[]>([])

    const [patchItem] = usePatchItemMutation()
    const [addItem] = useAddItemMutation()

    const { data: companyProfiles } = useGetCompanyProfilesQuery()

    const close = () => setOpen(false)

    const itemId = originItem?.item?.id
    const orderId = originItem?.origin_order!

    const successToast = (date: string | null, itemId: number) => {
        const isDateNull = date === null
        const formattedDate = isDateNull ? '' : format(date!, 'dd.MM.yyyy')

        const dateMessage = isDateNull
            ? 'Date has been reset'
            : `Date has been changed to ${formattedDate}`

        const scheduledDescription = isDateNull
            ? 'Production date has been reset. Item moved to Unscheduled'
            : dateMessage

        const unscheduledDescription = isDateNull
            ? dateMessage
            : 'Production date has been updated. Item moved to Scheduled'

        const description = scheduled ? scheduledDescription : unscheduledDescription

        toast.success(`Item ${itemId}`, {
            description: category === 'All' ? dateMessage : description
        })
    }

    const errorToast = (message: string, itemId: number) =>
        toast.error(`Item ${itemId}`, {
            description: message
        })

    const handleAddItem = async (data: ItemsAddData) => {
        try {
            await addItem(data)
                .unwrap()
                .then((data) => {
                    successToast(data.production_date!, data?.id)
                })
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(
                isErrorMessage ? error.data.detail : 'Something went wrong',
                itemId!
            )
        }
    }

    const handlePatchItem = async (data: ItemsPatchData) => {
        try {
            await patchItem(data)
                .unwrap()
                .then(() => successToast(data.data.production_date!, itemId!))
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(
                isErrorMessage ? error.data.detail : 'Something went wrong',
                itemId!
            )
        }
    }

    const handleSetDate = () => {
        const data = {
            production_date: format(date!, 'yyyy-MM-dd'),
            order: orderId
        }

        if (itemId) {
            handlePatchItem({
                id: itemId,
                data
            })
        } else {
            handleAddItem({
                ...data,
                origin_item: originItem?.id!
            })
        }

        close()
    }

    const handleResetDate = () => {
        handlePatchItem({
            id: itemId!,
            data: {
                production_date: null,
                order: orderId
            }
        })

        setDate(undefined)
        close()
    }

    useEffect(() => {
        if (companyProfiles?.working_weekend) {
            setDisabledDays([{ dayOfWeek: [0, 6] }])
        }
    }, [companyProfiles?.working_weekend])

    useEffect(() => {
        setDate(productionDate ? new Date(productionDate) : undefined)
    }, [productionDate])

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={originItem?.completed}
                    variant={'outline'}
                    className={cn(
                        '!w-40 justify-start text-left font-normal',
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
                                    <RotateCcw className='h-4 w-4 flex-shrink-0' />
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
