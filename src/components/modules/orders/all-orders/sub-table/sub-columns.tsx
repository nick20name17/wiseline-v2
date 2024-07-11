import type { ColumnDef } from '@tanstack/react-table'

import { FlowCell } from '../../cells/flow-cell'
import { ItemDatePickerCell } from '../../cells/item-date-picker-cell'
import { StatusCell } from '../../cells/status-cell'
import { CommentsSidebar } from '../../comments-sidebar'
import { dateFn, flowFn, notesFn, statusFn, widthLengthFn } from '../../utils/sorting'

import { DataTableColumnHeader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import type { EBMSItemsData } from '@/store/api/ebms/ebms.types'

export const subColumns: ColumnDef<EBMSItemsData>[] = [
    {
        accessorKey: 'category',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Prod. category'
                className='!w-40 justify-start text-left'
            />
        ),
        cell: ({ row }) => <div className='pl-4'>{row.original?.category}</div>,
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
        sortingFn: flowFn,
        cell: ({ row }) => (
            <FlowCell
                key={row?.original?.id}
                id={row?.original?.id}
                item={row.original.item!}
                orderId={row.original?.origin_order}
            />
        )
    },
    {
        accessorKey: 'status',
        sortingFn: statusFn,
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
        sortingFn: dateFn,
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
        accessorKey: 'quantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Ordered'
                className='!w-28'
            />
        ),
        cell: ({ row }) => <div className='text-center'>{row.original.quantity}</div>,
        sortingFn: 'alphanumeric'
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
        cell: ({ row }) => <div className='text-center'>{row.original.shipped!}</div>,
        sortingFn: 'alphanumeric'
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
        cell: ({ row }) => <div className='text-center'>{row.original.color || '-'}</div>
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
            <div className='text-center'>{row.original.profile || '-'}</div>
        )
    },
    {
        accessorKey: 'customer',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Customer'
                className='!w-64 justify-start text-left'
            />
        ),
        cell: ({ row }) => <div className='w-64 pl-4'>{row.original.customer || '-'}</div>
    },
    {
        accessorKey: 'id_inven',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='ID'
                className='!w-28 justify-start text-left'
            />
        ),
        cell: ({ row }) => <div className='w-28 pl-4'>{row.original?.id_inven}</div>
    },
    {
        accessorKey: 'bends',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Bends'
                className='!w-28'
            />
        ),
        cell: ({ row }) => <div className='text-center'>{row.original?.bends}</div>,
        sortingFn: 'alphanumeric'
    },
    {
        accessorKey: 'weight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Weight'
                className='!w-28 justify-start text-left'
            />
        ),
        cell: ({ row }) => <div className='text-center'>{row.original?.weight}</div>,
        sortingFn: 'alphanumeric'
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
        sortingFn: widthLengthFn,
        cell: ({ row }) => (
            <div className='text-center'>
                {row.original?.width + ' / ' + row.original?.length}
            </div>
        )
    },
    {
        accessorKey: 'description',
        header: () => (
            <Button
                variant='ghost'
                className='!w-64 justify-start text-left'>
                Description
            </Button>
        ),
        cell: ({ row }) => <div className='w-64 pl-4'>{row.original?.description}</div>
    },
    {
        accessorKey: 'comments',
        sortingFn: notesFn,
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
