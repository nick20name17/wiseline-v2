import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { Fragment, useEffect, useMemo } from 'react'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'

import { Pagination } from '../../controls/pagination'
import { Statuses } from '../../controls/statuses'

import { SearchBar, TableSkeleton } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
import type { EBMSItemsData } from '@/store/api/ebms/ebms.types'
import {
    useAddUsersProfilesMutation,
    useGetUsersProfilesQuery
} from '@/store/api/profiles/profiles'
import type { TableProps } from '@/types/table'
import { groupBy, stopEvent } from '@/utils'

export const ItemsTable = <_, TValue>({
    columns,
    data,
    isLoading,
    isFetching,
    setSorting,
    sorting,
    dataCount
}: TableProps<EBMSItemsData, TValue>) => {
    const [groupedView] = useQueryParam('grouped', BooleanParam)
    const [category] = useQueryParam('category', StringParam)
    const [scheduled] = useQueryParam('scheduled', BooleanParam)

    const { limit, offset, setPagination } = usePagination()

    const pageCount = useMemo(
        () => (dataCount ? Math.ceil(dataCount! / limit) : 0),
        [isLoading, limit, dataCount]
    )

    const { data: usersProfilesData } = useGetUsersProfilesQuery()

    const { columnOrder } = useColumnOrder(usersProfilesData!, 'items')
    const { columnVisibility } = useColumnVisibility(usersProfilesData!, 'items', columns)

    const [addUsersProfiles] = useAddUsersProfilesMutation()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
        pageCount,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        autoResetPageIndex: false,
        enableHiding: true,
        state: {
            sorting,
            columnVisibility,
            columnOrder,
            pagination: {
                pageIndex: offset / limit,
                pageSize: limit
            }
        }
    })

    const { onDragStart, onDrop } = useColumnDragDrop(table, 'items', addUsersProfiles)

    const groupByOrder = groupBy(table?.getRowModel()?.rows, 'original')

    const onCheckedChange = (value: boolean, group: any[]) => {
        const currentGroup = groupByOrder.filter((gr) => gr[0] === group[0])
        const currentGroupIds = currentGroup[0][1].map((obj) => obj.id)

        const obj = currentGroupIds
            .map((obj) => ({ [obj]: true }))
            .reduce((acc, val) => ({ ...acc, ...val }), {})

        if (value) {
            table.setRowSelection((prev) => ({
                ...prev,
                ...obj
            }))
        } else {
            table.setRowSelection((prev) => {
                const newSelection = { ...prev }
                currentGroupIds.forEach((id) => {
                    if (newSelection[id]) {
                        delete newSelection[id]
                    }
                })
                return newSelection
            })
        }
    }

    const colSpan = columns.length + 1

    useEffect(() => {
        table.setRowSelection({})
    }, [category, scheduled])

    return (
        <div className='rounded-md'>
            <div className='flex w-full flex-wrap items-start justify-between gap-5 border-t border-t-input py-2'>
                <div className='flex flex-wrap items-center justify-between gap-6 max-sm:w-full'>
                    <Statuses />
                    <SearchBar />
                </div>
                <Pagination
                    isDataLoading={isFetching || isLoading}
                    page='items'
                    table={table}
                />
            </div>

            <Table>
                <TableHeader>
                    {isLoading ? (
                        <TableRow className='p-0'>
                            <TableCell
                                colSpan={colSpan}
                                className='h-[41px] !px-0 py-1.5'>
                                <Skeleton className='h-[41px] w-full' />
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            draggable={
                                                !table.getState().columnSizingInfo
                                                    .isResizingColumn &&
                                                header.id !== 'flow' &&
                                                header.id !== 'status' &&
                                                header.id !== 'production_date'
                                            }
                                            className='w-2 !px-0.5 last:w-auto'
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
                                    )
                                })}
                            </TableRow>
                        ))
                    )}
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableSkeleton cellCount={columns.length} />
                    ) : table.getRowModel().rows?.length ? (
                        groupedView ? (
                            groupByOrder.map((group) =>
                                group[1].map((row, index) => {
                                    const isIndeterminate = group[1].some((row) =>
                                        row.getIsSelected()
                                    )
                                        ? group[1].every((row) => row.getIsSelected())
                                            ? true
                                            : 'indeterminate'
                                        : false

                                    return (
                                        <Fragment key={row.original?.id}>
                                            {index === 0 && (
                                                <TableRow className='!p-0'>
                                                    <TableCell
                                                        className='!p-0'
                                                        colSpan={colSpan}>
                                                        <Badge
                                                            variant='secondary'
                                                            className='!m-0 w-full !rounded-none py-2'>
                                                            <Checkbox
                                                                className='mr-4'
                                                                checked={isIndeterminate}
                                                                value={row.id}
                                                                onCheckedChange={(
                                                                    value
                                                                ) => {
                                                                    onCheckedChange(
                                                                        !!value,
                                                                        group
                                                                    )
                                                                }}
                                                                aria-label='Select row'
                                                            />
                                                            <div className='pl-4'>
                                                                {group[0]} |{' '}
                                                                {
                                                                    group[1][0].original
                                                                        ?.customer
                                                                }
                                                            </div>
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow
                                                className='odd:bg-secondary/60'
                                                data-state={
                                                    row.getIsSelected() && 'selected'
                                                }>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell
                                                        className='h-[53px] !px-0.5 py-1.5'
                                                        key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </Fragment>
                                    )
                                })
                            )
                        ) : (
                            table.getRowModel().rows.map((row) => {
                                return (
                                    <TableRow
                                        key={row.original?.id}
                                        className='odd:bg-secondary/60'
                                        data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                className='h-[53px] !px-0.5 py-1.5'
                                                key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        )
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
