import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'

import { subColumns } from './sub-columns'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import type { EBMSItemsData } from '@/store/api/ebms/ebms.types'

interface SubTableProps {
    data: EBMSItemsData[]
}

export const SubTable: React.FC<SubTableProps> = ({ data }) => {
    const subTable = useReactTable({
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        data,
        columns: subColumns,
        paginateExpandedRows: false,
        autoResetPageIndex: false
    })

    return (
        <Table>
            <TableHeader>
                {subTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead
                                key={header.id}
                                className='px-0.5 py-1.5'>
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
                {subTable.getRowModel().rows.map((row) => (
                    <TableRow key={row?.original?.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell
                                className='px-0.5 py-1.5'
                                key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
