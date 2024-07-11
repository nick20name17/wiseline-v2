import { Loader2 } from 'lucide-react'
import { type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import type { infer as zodInfer } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { changePasswordSchema } from '@/config/schemas'
import { useCustomForm } from '@/hooks'
import { useChangePasswordMutation } from '@/store/api/passwords/passwords'
import { useAppSelector } from '@/store/hooks/hooks'
import { selectUser } from '@/store/slices/auth'
import { isErrorWithMessage, stopPropagation } from '@/utils'

type FormData = zodInfer<typeof changePasswordSchema>

export const PasswordChange = () => {
    const [changePassword, { isLoading }] = useChangePasswordMutation()

    const form = useCustomForm(changePasswordSchema, {
        old_password: '',
        new_password1: '',
        new_password2: ''
    })

    const userId = useAppSelector(selectUser)?.id

    const successToast = () =>
        toast.success(`Change Password`, {
            description: 'Password changed successfully'
        })

    const errorToast = (description: string) =>
        toast.error('Change Password', { description })

    const handleChangePassword = async (data: FormData) => {
        try {
            await changePassword({ id: userId!, data })
                .unwrap()
                .then(() => successToast())
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
        form.reset()
    }

    const onSubmit: SubmitHandler<FormData> = (formData) => handleChangePassword(formData)

    return (
        <Card className='min-w-80 flex-1'>
            <CardHeader>
                <CardTitle> Change password</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        method='POST'
                        className='mx-auto mt-4 w-full space-y-5'
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='old_password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Old password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Old password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='new_password1'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='New password'
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
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Confirm password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={isLoading}
                            onClick={stopPropagation}
                            className='w-full'
                            type='submit'>
                            {isLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
