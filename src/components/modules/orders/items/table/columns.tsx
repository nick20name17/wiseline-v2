import type { ColumnDef } from '@tanstack/react-table'
import { BooleanParam, useQueryParam } from 'use-query-params'

import { FlowCell } from '../../cells/flow-cell'
import { InputCell } from '../../cells/input-cell'
import { ItemDatePickerCell } from '../../cells/item-date-picker-cell'
import { StatusCell } from '../../cells/status-cell'
import { TimePickerCell } from '../../cells/time-picker-cell'
import { CommentsSidebar } from '../../comments-sidebar'
import { MultipatchPopover } from '../multipatch-popover'

import { DataTableColumnHeader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { EBMSItemsData } from '@/store/api/ebms/ebms.types'

export const columns: ColumnDef<EBMSItemsData>[] = [
    {
        id: 'select',
        header: ({ table }) => {
            return (
                <div className='!w-10'>
                    <Checkbox
                        className='!ml-2'
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={(value) => {
                            table.toggleAllPageRowsSelected(!!value)
                        }}
                        aria-label='Select all'
                    />
                    <MultipatchPopover table={table} />
                </div>
            )
        },
        cell: ({ row }) => (
            <Checkbox
                className='!ml-2 mr-4 border border-muted-foreground data-[state=checked]:bg-muted-foreground'
                checked={row.getIsSelected()}
                value={row.original.id}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value)
                }}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'flow',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Flow/Machine'
                className='!w-40'
            />
        ),
        cell: ({ row }) => {
            return (
                <FlowCell
                    key={row?.original?.id}
                    id={row?.original?.id}
                    item={row.original.item!}
                    orderId={row.original.origin_order}
                />
            )
        }
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Status'
                className='!w-48'
            />
        ),
        cell: ({ row }) => (
            <StatusCell
                key={row?.original?.id}
                item={row.original?.item}
                invoice={row.original?.order}
                originOrderId={row.original?.origin_order}
            />
        )
    },
    {
        accessorKey: 'production_date',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Prod. date'
                className='!w-40'
            />
        ),
        cell: ({ row }) => (
            <ItemDatePickerCell
                key={row.original?.id}
                originItem={row.original}
            />
        )
    },
    {
        accessorKey: 'time',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Time'
                className='!w-24'
            />
        ),
        cell: ({ row }) => {
            return (
                <TimePickerCell
                    // isDisabled={!row.original.item?.flow?.id || row.original.completed}
                    isDisabled={row.original.completed}
                    item={row?.original?.item}
                    originItemId={row.original?.id}
                    orderId={row.original.origin_order}
                />
            )
        }
    },
    {
        accessorKey: 'priority',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Prio.'
                className='!w-20'
            />
        ),
        cell: ({ row }) => (
            <InputCell
                key={row.original?.id}
                name='priority'
                value={row.original?.item?.priority!}
                itemId={row.original?.item?.id}
                orderId={row.original.origin_order}
                order={row.original.order!}
                originItemId={row.original?.id}
            />
        ),
        accessorFn: (row) => row.item?.priority
    },
    {
        accessorKey: 'packages',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Pckgs'
                className='!w-20'
            />
        ),
        cell: ({ row }) => (
            <InputCell
                key={row.original?.id}
                name='packages'
                value={row.original?.item?.packages!}
                itemId={row.original?.item?.id}
                orderId={row.original.origin_order}
                order={row.original.order!}
                originItemId={row.original?.id}
            />
        )
    },
    {
        accessorKey: 'location',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Loc.'
                className='!w-20'
            />
        ),
        cell: ({ row }) => (
            <InputCell
                key={row.original?.id}
                name='location'
                value={row.original?.item?.location!}
                itemId={row.original?.item?.id}
                orderId={row.original.origin_order}
                order={row.original.order!}
                originItemId={row.original?.id}
            />
        )
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Ordered'
                className='!w-28'
            />
        ),
        cell: ({ row }) => (
            <div className='!w-28 text-center'>{row.original.quantity || '-'}</div>
        )
    },
    {
        accessorKey: 'shipped',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Shipped'
                className='!w-28'
            />
        ),
        cell: ({ row }) => (
            <div className='w-28 text-center'>{row.original.shipped || '-'}</div>
        )
    },
    {
        accessorKey: 'color',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Color'
                className='!w-28'
            />
        ),
        cell: ({ row }) => (
            <div className='w-28 text-center'>{row.original.color || '-'}</div>
        )
    },
    {
        accessorKey: 'profile',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Profile'
                className='!w-28'
            />
        ),
        cell: ({ row }) => (
            <div className='w-28 text-center'>{row.original.profile || '-'}</div>
        )
    },
    // {
    //     accessorKey: 'customer',
    //     header: ({ column }) =>
    //         createHeader('Customer', column, 'text-left justify-start !w-64'),
    //     cell: ({ row }) => (
    //         <div className='w-64 pl-4'>{getValidValue(row.original.customer)}</div>
    //     )
    // },
    {
        accessorKey: 'id_inven',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='ID'
                className='!w-24 justify-start text-left'
            />
        ),
        cell: ({ row }) => <div className='!w-24 pl-4'>{row.original?.id_inven}</div>
    },
    {
        accessorKey: 'weight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Weight'
                className='!w-28'
            />
        ),
        cell: ({ row }) => (
            <div className='w-28 text-center'>{row.original.weight || '-'}</div>
        )
    },
    {
        accessorKey: 'w/l',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='W/L'
                className='!w-28'
            />
        ),
        cell: ({ row }) => (
            <div className='text-center'>
                {row.original?.width + ' / ' + row.original?.length}
            </div>
        )
    },
    {
        accessorKey: 'description',
        header: () => {
            const [groupedView] = useQueryParam('grouped', BooleanParam)

            return (
                <Button
                    disabled={groupedView!}
                    variant='ghost'
                    className='!w-64 justify-start text-left'>
                    Description
                </Button>
            )
        },
        cell: ({ row }) => <div className='!w-64 pl-4'>{row.original?.description}</div>
    },
    {
        accessorKey: 'comments',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Notes'
                className='!w-32'
            />
        ),
        cell: ({ row }) => <CommentsSidebar originItem={row.original} />
    }
]
