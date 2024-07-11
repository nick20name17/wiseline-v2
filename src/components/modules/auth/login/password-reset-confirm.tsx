import { Loader2 } from 'lucide-react'
import { type SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import type { infer as zodInfer } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { routes } from '@/config/routes'
import { passwordResetConfirmSchema } from '@/config/schemas'
import { useCustomForm } from '@/hooks'
import { usePasswordResetConfirmMutation } from '@/store/api/passwords/passwords'
import { isErrorWithMessage } from '@/utils'

type FormData = zodInfer<typeof passwordResetConfirmSchema>

export const PasswordResetConfirm = () => {
    const navigate = useNavigate()

    const { uidb64, token } = useParams()

    const form = useCustomForm(passwordResetConfirmSchema, {
        new_password1: '',
        new_password2: ''
    })

    const successToast = () =>
        toast.success('Password reset confirmation', {
            description:
                'Password reset confirmation successful! You can now login with your new password!'
        })

    const errorToast = (message: string) =>
        toast.error('Password reset', {
            description: message
        })

    const [resetPasswordConfirm, { isLoading }] = usePasswordResetConfirmMutation()

    const handleResetPasswordConfirm = async (data: FormData) => {
        try {
            await resetPasswordConfirm({
                uidb64: uidb64!,
                token: token!,
                ...data
            })
                .unwrap()
                .then(() => successToast())

            navigate(routes.login)

            form.setValue('new_password1', '')
            form.setValue('new_password2', '')
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onSubmit: SubmitHandler<FormData> = (formData) =>
        handleResetPasswordConfirm(formData)

    return (
        <div className='flex h-screen items-center justify-center'>
            <Form {...form}>
                <form
                    className='mx-auto w-[300px] space-y-5'
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name='new_password1'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New password</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='password'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='new_password2'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm new password</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='password'
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
                            'Confirm password reset'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
