import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { StringParam, useQueryParam } from 'use-query-params'

import { TableSkeleton } from './table-skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import type { UserData } from '@/store/api/users/users.types'
import type { BaseTableProps } from '@/types/table'

export function UsersTable<TValue>({
    columns,
    data,
    isLoading
}: BaseTableProps<UserData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableHiding: true
    })

    const [searchTerm = ''] = useQueryParam('search', StringParam)

    const filteredData = table
        .getRowModel()
        .rows.filter(
            ({ original: { email, first_name, last_name } }) =>
                email.toLowerCase().includes(searchTerm!) ||
                first_name.toLowerCase().includes(searchTerm!) ||
                last_name.toLowerCase().includes(searchTerm!)
        )

    return (
        <>
            <Table className='mt-2'>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableSkeleton />
                    ) : filteredData.length ? (
                        filteredData.map((row) => (
                            <TableRow
                                key={row.id}
                                className='odd:bg-secondary/60'
                                data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        className='h-[53px] py-1.5'
                                        key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className='h-24 pl-3 text-left'>
                                No results
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}
