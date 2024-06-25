import React from 'react'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'

interface TooltipCellProps {
    value: string
    truncedValue: string
}
export const TooltipCell: React.FC<TooltipCellProps> = ({ truncedValue, value }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>{truncedValue}</span>
                </TooltipTrigger>
                <TooltipContent className='max-w-64'>
                    <span>{value}</span>j
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
