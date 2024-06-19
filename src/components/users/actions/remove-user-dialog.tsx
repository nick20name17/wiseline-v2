import { Loader2, X } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { useRemoveUserMutation } from '@/store/api/users/users'
import type { UserData } from '@/store/api/users/users.types'
import { isErrorWithMessage, stopPropagation } from '@/utils'

interface Props {
    user: UserData
}

export const RemoveUserDialog: React.FC<Props> = ({ user }) => {
    // const isDisabled = user.role === 'admin'
    const userName = `${user.first_name} ${user.last_name}`
    const userId = user.id

    const [removeUser, { isLoading }] = useRemoveUserMutation()

    const [open, setOpen] = useState(false)

    const successToast = () =>
        toast.success(`User ${userName}`, {
            description: 'Removed successfully'
        })

    const errorToast = (message: string) =>
        toast.error(`User ${userName}`, {
            description: message
        })

    const handleRemoveUser = async (id: number) => {
        try {
            await removeUser(id).unwrap().then(successToast)
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={stopPropagation}
                    className='justify-start'
                    variant='ghost'
                    size='sm'>
                    <X className='mr-2 h-3.5 w-3.5' />
                    Remove
                </Button>
            </DialogTrigger>
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>
                        Do you want to remove{' '}
                        <span className='text-destructive'>{userName}</span> ?
                    </DialogTitle>
                </DialogHeader>
                <Button
                    // disabled={isDisabled}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveUser(userId)
                    }}
                    variant='destructive'
                    className='flex w-fit items-center gap-x-1.5'>
                    {isLoading ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                    ) : false ? (
                        "Can't remove admin"
                    ) : (
                        'Remove'
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
