import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { useCallbackDebounce } from '@/hooks/use-callback-debounce'
import {
    useAddSalesOrderMutation,
    usePatchSalesOrderMutation
} from '@/store/api/sales-orders/sales-orders'
import { useAppSelector } from '@/store/hooks/hooks'
import { selectUser } from '@/store/slices/auth'
import type { InputEvent } from '@/types/common'
import { capitalize } from '@/utils/capitalize'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface Props {
    name: 'priority' | 'packages' | 'location'
    value: number
    orderId: string
    itemId: number | undefined
    invoice: string
}

export const SalesOrderCell: React.FC<Props> = ({
    value,
    orderId,
    name,
    itemId,
    invoice
}) => {
    const [addSalesOrder] = useAddSalesOrderMutation()
    const [patchSalesOrder] = usePatchSalesOrderMutation()

    const successToast = (message: string) => {
        toast.success(`${capitalize(name)} of ${invoice} order`, {
            description: message + ' successfully'
        })
    }

    const errorToast = (message: string) => {
        toast.error(`${capitalize(name)} of ${invoice} order`, {
            description: message
        })
    }

    const handleAddSalesOrder = async (value: number) => {
        try {
            await addSalesOrder({
                order: orderId,
                [name]: value
            })
                .unwrap()
                .then(() => {
                    successToast('Added')
                })
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)

            const errorMessage = isErrorMessage
                ? error.data[name as keyof typeof error.data]
                : 'Something went wrong'

            errorToast(errorMessage)
        }
    }

    const handlePatchSalesOrder = async (value: number, id: number) => {
        try {
            await patchSalesOrder({
                id,
                data: {
                    order: orderId,
                    [name]: value
                }
            })
                .unwrap()
                .then(() => {
                    successToast('Updated')
                })
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)

            const errorMessage = isErrorMessage
                ? error.data[name as keyof typeof error.data]
                : 'Something went wrong'

            errorToast(errorMessage)
        }
    }

    const [currentValue, setCurrentValue] = useState(value)

    const handleItemMutation = useCallbackDebounce((value: number) => {
        if (itemId) {
            handlePatchSalesOrder(value, itemId)
        } else {
            handleAddSalesOrder(value)
        }
    }, 300)

    useEffect(() => {
        setCurrentValue(value)
    }, [value])

    const onValueChange = (e: InputEvent) => {
        const value = +e.target.value
        setCurrentValue(value)
        handleItemMutation(value)
    }

    const userRole = useAppSelector(selectUser)?.role
    const isWorker = userRole === 'worker'

    return (
        <div className='w-20'>
            <Input
                disabled={isWorker && name === 'priority'}
                value={currentValue}
                type='number'
                inputMode='numeric'
                placeholder='0'
                onChange={onValueChange}
            />
        </div>
    )
}
