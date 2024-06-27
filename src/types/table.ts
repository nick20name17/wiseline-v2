import type { Column, ColumnDef, SortingState } from '@tanstack/react-table'

export interface TableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading: boolean
    isFetching: boolean
    dataCount?: number
    sorting: SortingState
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}

export interface BaseTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading: boolean
}

export interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
    className?: string
}
