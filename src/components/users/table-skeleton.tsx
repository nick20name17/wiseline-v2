import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export const TableSkeleton = () => {
    return Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableCell key={index}>
                    <Skeleton className='h-8 w-full' />
                </TableCell>
            ))}
        </TableRow>
    ))
}
