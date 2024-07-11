import { MoreHorizontal } from 'lucide-react'

import { EditPriority } from './edit-priority'
import { RemovePriority } from './remove-priority'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { PrioritiesData } from '@/store/api/priorities/priorities.types'
import { useAppSelector } from '@/store/hooks/hooks'
import { selectUser } from '@/store/slices/auth'

interface PriorityActionsProps {
    priority: PrioritiesData
}

export const PriorityActions: React.FC<PriorityActionsProps> = ({ priority }) => {
    const userRole = useAppSelector(selectUser)?.role
    const isWorkerOrUser = userRole === 'worker' || userRole === 'client'

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={isWorkerOrUser}
                    variant='ghost'
                    size='icon'>
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='flex w-fit flex-col p-2'>
                <EditPriority priority={priority} />
                <RemovePriority priority={priority} />
            </PopoverContent>
        </Popover>
    )
}
