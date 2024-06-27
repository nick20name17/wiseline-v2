import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { StringParam, useQueryParam } from 'use-query-params'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import type { Item } from '@/store/api/ebms/ebms.types'
import { useGetFlowsQuery } from '@/store/api/flows/flows'
import {
    useAddItemMutation,
    useAddOrderItemMutation,
    usePatchItemMutation,
    usePatchOrderItemMutation
} from '@/store/api/items/items'
import type { ItemsAddData, ItemsPatchData } from '@/store/api/items/items.types'

interface Props {
    item: Item | undefined
    orderId: string
    id: string
}

export const FlowCell: React.FC<Props> = ({ item, orderId, id }) => {
    const [category] = useQueryParam('category', StringParam)
    const { data: flowsData } = useGetFlowsQuery({
        category__prod_type: category!
    })

    const { flow, id: itemId } = item || {}
    const flowId = flow?.id

    const [defalutValue, setDefaultValue] = useState(flowId ? String(flowId) : '')

    const [patchItemStatus] = usePatchItemMutation()
    const [patchOrderStatus] = usePatchOrderItemMutation()

    const [addItem] = useAddItemMutation()
    const [addOrderItem] = useAddOrderItemMutation()

    const handlePatchItem = async (data: ItemsPatchData) => {
        try {
            if (category === 'All') {
                await patchOrderStatus(data).unwrap()
            } else {
                await patchItemStatus(data).unwrap()
            }
        } catch (error) {
            toast.error('Error patching item')
        }
    }

    const handleAddItem = async (data: Partial<ItemsAddData>) => {
        try {
            if (category === 'All') {
                await addOrderItem(data).unwrap()
            } else {
                await addItem(data).unwrap()
            }
        } catch (error) {
            toast.error('Error adding item')
        }
    }

    const onValueChange = (value: string) => {
        const flowName = flowsData?.results?.find((flow) => flow.id === +value)?.name

        const data = {
            flow: +value,
            flowName,
            order: orderId
        }

        setDefaultValue(value)

        if (itemId) {
            handlePatchItem({
                id: itemId!,
                data
            })
        } else {
            handleAddItem({
                order: orderId,
                flowName,
                origin_item: id,
                flow: +value
            })
        }
    }

    useEffect(() => {
        setDefaultValue(flowId ? String(flowId) : '')
    }, [flowId])

    return (
        <Select
            disabled={!flowsData?.results?.length}
            defaultValue={defalutValue}
            value={defalutValue}
            onValueChange={onValueChange}>
            <SelectTrigger className='!w-40 text-left'>
                <SelectValue placeholder='Select flow' />
            </SelectTrigger>
            <SelectContent>
                {flowsData?.results?.map((flow) => (
                    <SelectItem
                        key={flow.id}
                        value={String(flow.id)}>
                        {flow.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
