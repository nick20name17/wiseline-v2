import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { useRemovePriorityMutation } from '@/store/api/priorities/priorities'
import type { PrioritiesData } from '@/store/api/priorities/priorities.types'
import type { ButtonEvent } from '@/types/common'
import { isErrorWithMessage } from '@/utils'
import { stopPropagation } from '@/utils/stop-events'

interface RemovePriorityProps {
    priority: PrioritiesData
}

export const RemovePriority: React.FC<RemovePriorityProps> = ({ priority }) => {
    const [removePriority, { isLoading }] = useRemovePriorityMutation()

    const [open, setOpen] = useState(false)

    const handleRemoveStage = async (id: number) => {
        try {
            await removePriority(id).unwrap()
            setOpen(false)
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onRemove = (e: ButtonEvent) => {
        e.stopPropagation()
        handleRemoveStage(priority.id)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={stopPropagation}
                    variant='ghost'
                    size='sm'>
                    <X className='mr-1 h-3.5 w-3.5' />
                    Remove
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[470px]'>
                <DialogHeader className='text-left'>
                    <DialogTitle>
                        Do you want to remove{' '}
                        <span className='text-destructive'>{priority.name}</span>{' '}
                        priority?
                    </DialogTitle>
                </DialogHeader>
                <Button
                    disabled={isLoading}
                    onClick={onRemove}
                    variant='destructive'
                    className='flex w-24 items-center gap-x-1.5'>
                    {isLoading ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                        'Remove'
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
