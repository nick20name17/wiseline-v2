import { zodResolver } from '@hookform/resolvers/zod'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { ZodSchema, type infer as zodInfer } from 'zod'

export const useCustomForm = <T extends ZodSchema>(
    validationSchema: T,
    values?: zodInfer<T>
): UseFormReturn<zodInfer<T>> => {
    const form = useForm<zodInfer<T>>({
        resolver: zodResolver(validationSchema),
        mode: 'onSubmit',
        shouldFocusError: true,
        values
    })

    return form
}
