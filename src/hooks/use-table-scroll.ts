import { useEffect, useState } from 'react'

interface UseTableScrollProps {
    tableRef: React.RefObject<HTMLTableElement>
    enableScroll?: boolean
}

export const useTableScroll = ({ tableRef, enableScroll }: UseTableScrollProps) => {
    const [tableHeight, setTableHeight] = useState<number>(window.innerHeight)

    useEffect(() => {
        const headerElement = document.querySelector('#order-header')
        const statusesElement = document.querySelector('#order-statuses')
        const paginationElement = document.querySelector('#order-pagination')

        const handleResize = () => {
            const headerHeight = headerElement?.clientHeight || 0
            const statusesHeight = statusesElement?.clientHeight || 0
            const paginationHeight = paginationElement?.clientHeight || 0

            setTableHeight(
                window.innerHeight - headerHeight - statusesHeight - paginationHeight - 15
            )
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        if (tableRef?.current && enableScroll) {
            tableRef.current.style.height = `${tableHeight}px`
            tableRef.current.style.overflowY = 'auto'
        } else if (tableRef?.current && !enableScroll) {
            tableRef.current.style.height = 'auto'
            tableRef.current.style.overflowY = 'unset'
        }

        return () => window.removeEventListener('resize', handleResize)
    }, [tableRef, tableHeight, enableScroll])
}
