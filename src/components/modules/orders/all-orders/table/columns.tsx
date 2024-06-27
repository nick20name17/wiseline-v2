import type { ColumnDef } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'

import { OrderDatePickerCell } from '../../cells/order-date-picker-cell'
import { ShipDatePickerCell } from '../../cells/ship-date-picker'
import { SalesOrderCell } from '../cells/sales-order-cell'
import { MultipatchPopover } from '../multipatch-popover'

import { DataTableColumnHeader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { OrdersData } from '@/store/api/ebms/ebms.types'

export const columns: ColumnDef<OrdersData>[] = [
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
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label='Select all'
                    />
                    <MultipatchPopover table={table} />
                </div>
            )
        },
        cell: ({ row }) => (
            <Checkbox
                className='!ml-2 mt-[3px]'
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
        header: () => (
            <Button
                variant='ghost'
                className='w-full'>
                <div className='h-4 w-4 flex-shrink-0' />
            </Button>
        ),
        id: 'arrow',
        enableHiding: false,
        cell: ({ row }) => (
            <CollapsibleTrigger
                asChild
                className='duration-15 transition-transform data-[state=open]:-rotate-90'
                disabled={!row.original?.origin_items?.length}>
                <Button
                    variant='ghost'
                    size='icon'>
                    <ChevronDown
                        className={cn(
                            'duration-15 h-4 w-4 transition-transform',
                            !row.original.origin_items?.length &&
                                'cursor-not-allowed opacity-50'
                        )}
                    />
                </Button>
            </CollapsibleTrigger>
        )
    },
    {
        accessorKey: 'invoice',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Invoice'
                className='w-[103px]'
            />
        ),
        cell: ({ row }) => (
            <div className='w-[103px] text-center'>{row.original?.invoice}</div>
        )
    },
    {
        accessorKey: 'customer',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Customer'
                className='w-64 justify-start text-left'
            />
        ),
        cell: ({ row }) => (
            <div className='w-64 pl-4 pr-1'>{row.original?.customer || '-'}</div>
        )
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
            <SalesOrderCell
                key={row.original?.id}
                name='priority'
                invoice={row.original?.invoice!}
                value={row.original?.sales_order?.priority!}
                itemId={row.original?.sales_order?.id}
                orderId={row.original.id}
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
        cell: ({ row }) => <OrderDatePickerCell order={row.original} />
    },
    {
        accessorKey: 'ship_date',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Ship date'
                className='!w-40'
            />
        ),
        cell: ({ row }) => <ShipDatePickerCell order={row.original} />
    },
    {
        accessorKey: 'c_name',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Name'
                className='w-64 max-w-64 justify-start text-left'
            />
        ),
        cell: ({ row }) => <div className='w-64 pl-4'>{row.original.c_name || '-'}</div>
    },
    {
        accessorKey: 'c_city',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='City'
                className='w-32'
            />
        ),
        cell: ({ row }) => (
            <div className='w-32 text-center'>{row.original.c_city || '-'}</div>
        )
    },
    {
        accessorKey: 'count_items',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Line Items'
                className='w-28'
            />
        ),
        cell: ({ row }) => (
            <div className='w-28 text-center'>{row.original?.count_items}</div>
        )
    }
]
