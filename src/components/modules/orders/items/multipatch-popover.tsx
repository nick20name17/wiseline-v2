import type { Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'

import { MultipatchDatePicker } from './multipatch-date-picker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import type { EBMSItemsData } from '@/store/api/ebms/ebms.types'
import { useGetFlowsQuery } from '@/store/api/flows/flows'
import { useMultiPatchItemsMutation } from '@/store/api/multiupdates/multiupdate'
import type { MultiPatchItemsData } from '@/store/api/multiupdates/multiupdate.types'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface MultipatchPopoverProps {
    table: Table<EBMSItemsData>
}

export const MultipatchPopover: React.FC<MultipatchPopoverProps> = ({ table }) => {
    const [category] = useQueryParam('category', StringParam)
    const [scheduled] = useQueryParam('scheduled', BooleanParam)
    const [completed] = useQueryParam('completed', BooleanParam)

    const rows = table.getSelectedRowModel().rows.map((row) => row.original)

    const handleRowReset = () => table.resetRowSelection()

    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)

    const [currentRows, setCurrentRows] = useState(rows)

    useEffect(() => {
        if (JSON.stringify(rows) !== JSON.stringify(currentRows)) {
            setCurrentRows(rows)
        }
    }, [rows])

    const { data } = useGetFlowsQuery({ category__prod_type: category! })

    const [flow, setFlow] = useState(-1)

    const close = () => setOpen(false)

    const flowsData = data?.results

    const [patchItems, { isLoading }] = useMultiPatchItemsMutation()

    const successToast = (date: string, flow: number) => {
        const flowName = flowsData?.find((item) => item.id === flow)?.name

        const message = (
            <span>
                {date && scheduled ? (
                    <>
                        Item(s) move to <span className='font-semibold'>Scheduled</span>.
                        Production date ➝ <span className='font-semibold'>{date}</span>
                        <br />
                    </>
                ) : (
                    date && (
                        <>
                            Production date ➝{' '}
                            <span className='font-semibold'>{date}</span>
                            <br />
                        </>
                    )
                )}
                {flow !== -1 && (
                    <>
                        Flow ➝ <span className='font-semibold'>{flowName}</span>
                    </>
                )}
            </span>
        )

        toast.success(`${currentRows.length} item(s) updated`, {
            description: message
        })
    }

    const errorToast = (description: string) =>
        toast.error('Something went wrong', {
            description
        })

    const handlePatchItem = async (flow: number, date: string | null) => {
        const dataToPatch: MultiPatchItemsData = {
            origin_items: currentRows.map((row) => row.id)
        }

        if (flow !== -1) dataToPatch.flow = flow
        if (date) dataToPatch.production_date = date

        try {
            await patchItems(dataToPatch)
                .unwrap()
                .then(() => successToast(dataToPatch.production_date!, flow))
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)

            const errorMessage = isErrorMessage ? error.data.detail : 'Unknown error'

            errorToast(errorMessage)
        }
    }

    const onSave = () => {
        const dateToPatch = date ? format(date!, 'yyyy-MM-dd') : null

        handlePatchItem(flow, dateToPatch)
        close()
        setFlow(-1)
        setDate(undefined)
        handleRowReset()
    }

    const onValueChange = (value: string) => setFlow(+value)

    useEffect(() => setOpen(currentRows.length > 0), [currentRows.length])

    const isSaveDisabled = flow === -1 && !date

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}>
            <PopoverTrigger className='fixed bottom-20 left-1/2 z-10 -translate-x-1/2'></PopoverTrigger>
            <PopoverContent className='w-96'>
                <div className='grid gap-4'>
                    <div className='space-y-2'>
                        <h4 className='flex items-center gap-x-2 font-medium leading-none'>
                            <Badge className='pointer-events-none'>
                                {currentRows.length}
                            </Badge>
                            Row(s) selected
                        </h4>
                    </div>

                    {/* {isItemsWithoutFlow ? (
                        <p className='text-sm text-gray-500'>
                            <span className='font-bold'>{itemsWithoutFlow} </span>
                            item(s) have no flow, please select flow for all items or{' '}
                            <Button
                                onClick={removeItemsWithoutFlow}
                                className='p-0 h-fit'
                                variant='link'
                                size='sm'>
                                remove
                            </Button>{' '}
                            this item(s) from selection to set date
                        </p>
                    ) : null} */}
                    {completed ? (
                        <p className='text-sm text-gray-500'>
                            You can't update date for completed orders
                        </p>
                    ) : null}
                    <div className='flex items-center gap-x-2'>
                        <MultipatchDatePicker
                            disabled={completed!}
                            date={date}
                            setDate={setDate}
                        />
                        <Select onValueChange={onValueChange}>
                            <SelectTrigger className='w-[140px] flex-1 text-left'>
                                <SelectValue placeholder='Select flow' />
                            </SelectTrigger>
                            <SelectContent>
                                {flowsData?.map((flow) => (
                                    <SelectItem
                                        key={flow.id}
                                        value={String(flow.id)}>
                                        {flow.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex items-center justify-between gap-x-2'>
                        <Button
                            onClick={onSave}
                            className='flex-1'
                            disabled={isSaveDisabled}>
                            {isLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                'Save'
                            )}
                        </Button>
                        <Button
                            onClick={close}
                            className='flex-1'
                            variant='secondary'>
                            Cancel
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
