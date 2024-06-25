import { Time } from '@internationalized/date'
import { useEffect, useState } from 'react'
import type { TimeValue } from 'react-aria'
import { toast } from 'sonner'

import { TimePicker } from '@/components/ui/time-picker/time-picker'
import { useCallbackDebounce } from '@/hooks'
import type { Item } from '@/store/api/ebms/ebms.types'
import { useAddItemMutation, usePatchItemMutation } from '@/store/api/items/items'
import type { ItemsAddData } from '@/store/api/items/items.types'

interface TimePickerCellProps {
    item: Item | null
    originItemId: string
    orderId: string
    isDisabled?: boolean
}

export const TimePickerCell: React.FC<TimePickerCellProps> = ({
    item,
    orderId,
    originItemId,
    isDisabled = false
}) => {
    const [hour, minute] = item?.time?.split(':')?.map(Number) ?? []

    const [time, setTime] = useState(item?.time ? new Time(hour, minute) : null)

    const [patchItem] = usePatchItemMutation()
    const [addItem] = useAddItemMutation()

    const handlePatchOrder = async (value: string) => {
        try {
            await patchItem({
                id: item?.id!,
                data: {
                    origin_item: originItemId,
                    time: value
                }
            }).unwrap()
        } catch {}
    }

    const errorToast = ({ message, title }: { message: string; title: string }) =>
        toast.error(title, {
            description: message
        })

    const handleAddItem = async (data: ItemsAddData) => {
        try {
            await addItem(data).unwrap()
        } catch (error) {
            errorToast({
                message: 'Error adding item',
                title: 'Something went wrong'
            })
        }
    }

    const debouncedRequest = useCallbackDebounce((value: TimeValue) => {
        if (item?.id) {
            handlePatchOrder(value.toString())
        } else {
            handleAddItem({
                order: orderId,
                origin_item: originItemId,
                time: value.toString()
            })
        }
    }, 400)

    const onChange = (value: TimeValue) => {
        const [hour, minute] = value?.toString().split(':')?.map(Number)

        setTime(new Time(hour, minute))
        debouncedRequest(value)
    }

    useEffect(() => {
        setTime(item?.time ? new Time(hour, minute) : null)
    }, [item?.time])

    return (
        <TimePicker
            isDisabled={isDisabled}
            time={time}
            onChange={onChange}
        />
    )
}
