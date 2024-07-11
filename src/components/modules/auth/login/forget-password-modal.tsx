import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import type { infer as zodInfer } from 'zod'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui//dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui//form'
import { Input } from '@/components/ui//input'
import { Button } from '@/components/ui/button'
import { emailSchema } from '@/config/schemas'
import { useCustomForm } from '@/hooks'
import { usePasswordResetMutation } from '@/store/api/passwords/passwords'
import { isErrorWithMessage } from '@/utils'

type FormData = zodInfer<typeof emailSchema>

interface ForgetPasswordModalProps {
    disabled: boolean
}

export const ForgetPasswordModal: React.FC<ForgetPasswordModalProps> = ({ disabled }) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)

    const form = useCustomForm(emailSchema, { email: '' })

    const [passwordReset, { isLoading }] = usePasswordResetMutation()

    const successToast = (message: string) =>
        toast.success('Password reset', {
            description: message
        })

    const errorToast = (message: string) =>
        toast.error('Password reset', {
            description: message
        })

    const handlePasswordReset = async (data: FormData) => {
        try {
            await passwordReset(data)
                .unwrap()
                .then(() => successToast('Password reset link sent to your email'))

            form.reset()
            handleClose()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onSubmit: SubmitHandler<FormData> = (formData) => handlePasswordReset(formData)

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger
                disabled={disabled}
                className='text-sm text-neutral-400 transition-colors hover:text-neutral-600'>
                Forgot password?
            </DialogTrigger>
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Password reset</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className='mx-auto w-full space-y-5'
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='nickname@gmail.com'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={isLoading}
                            className='w-full'
                            type='submit'>
                            {isLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                'Send reset link'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
