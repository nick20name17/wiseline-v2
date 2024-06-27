import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { useEffect, useMemo } from 'react'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'

import { Pagination } from '../../controls/pagination'
import { Statuses } from '../../controls/statuses'
import { SubTable } from '../sub-table/sub-table'

import { SearchBar, TableSkeleton } from '@/components/shared'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { usePagination } from '@/hooks'
import {
    useColumnDragDrop,
    useColumnOrder,
    useColumnVisibility
} from '@/hooks/use-column-controls'
import type { OrdersData } from '@/store/api/ebms/ebms.types'
import {
    useAddUsersProfilesMutation,
    useGetUsersProfilesQuery
} from '@/store/api/profiles/profiles'
import type { TableProps } from '@/types/table'
import { stopEvent } from '@/utils'

export const OrdersTable = <_, TValue>({
    data,
    isFetching,
    isLoading,
    setSorting,
    dataCount,
    sorting,
    columns
}: TableProps<OrdersData, TValue>) => {
    const { limit, offset, setPagination } = usePagination()

    const { data: usersProfilesData } = useGetUsersProfilesQuery()
    const [addUsersProfiles] = useAddUsersProfilesMutation()

    const { columnOrder } = useColumnOrder(usersProfilesData!, 'orders')

    const { columnVisibility } = useColumnVisibility(
        usersProfilesData!,
        'orders',
        columns
    )

    const pageCount = useMemo(
        () => (dataCount ? Math.ceil(dataCount! / limit) : 0),
        [isLoading, limit, dataCount]
    )

    const table = useReactTable({
        getSubRows: (originalRow) => (originalRow as any)?.origin_items || [],
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        data,
        columns,
        manualPagination: true,
        manualSorting: true,
        manualExpanding: true,
        pageCount,
        paginateExpandedRows: false,
        autoResetPageIndex: false,
        state: {
            columnVisibility,
            sorting,
            columnOrder,
            pagination: {
                pageIndex: offset / limit,
                pageSize: limit
            }
        }
    })

    const { onDragStart, onDrop } = useColumnDragDrop(table, 'orders', addUsersProfiles)

    const colSpan = columns.length + 1

    const [overdue] = useQueryParam('overdue', BooleanParam)
    const [completed] = useQueryParam('completed', BooleanParam)
    const [scheduled] = useQueryParam('scheduled', BooleanParam)
    const [searchTerm] = useQueryParam('search', StringParam)

    useEffect(() => {
        table.setPageIndex(0)
    }, [overdue, completed, scheduled, searchTerm])

    return (
        <div className='rounded-md'>
            <div className='flex w-full flex-wrap items-start justify-between gap-5 border-t border-t-input py-2'>
                <div className='flex flex-wrap items-center justify-between gap-6 max-sm:w-full'>
                    <Statuses />
                    <SearchBar />
                </div>
                <Pagination
                    isDataLoading={isFetching || isLoading}
                    page='orders'
                    table={table}
                />
            </div>

            <Table>
                <TableHeader>
                    {isLoading ? (
                        <TableRow className='p-0'>
                            <TableCell
                                colSpan={colSpan}
                                className='h-[39px] !px-0 py-1.5'>
                                <Skeleton className='h-[39px] w-full opacity-50' />
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        className='w-2 px-0.5 last:w-auto'
                                        draggable={
                                            !table.getState().columnSizingInfo
                                                .isResizingColumn
                                        }
                                        data-column-index={header.index}
                                        onDragStart={onDragStart}
                                        onDragOver={stopEvent}
                                        onDrop={onDrop}
                                        colSpan={header.colSpan}
                                        key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableSkeleton cellCount={columns.length} />
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                            const originItems = row.original?.origin_items

                            return (
                                <Collapsible
                                    key={row?.id}
                                    asChild>
                                    <>
                                        <TableRow
                                            className='odd:bg-secondary/60'
                                            data-state={
                                                row.getIsSelected() && 'selected'
                                            }>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    className='px-0 py-1.5 first:w-10 [&div]:h-[53px]'
                                                    key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>

                                        <CollapsibleContent asChild>
                                            <tr>
                                                <td
                                                    className='max-w-[100vw]'
                                                    colSpan={colSpan}>
                                                    <SubTable data={originItems} />
                                                </td>
                                            </tr>
                                        </CollapsibleContent>
                                    </>
                                </Collapsible>
                            )
                        })
                    ) : isFetching ? (
                        <TableSkeleton cellCount={columns.length} />
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={colSpan}
                                className='h-24 pl-4 text-left'>
                                No results
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
