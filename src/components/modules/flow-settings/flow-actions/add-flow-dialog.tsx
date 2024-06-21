import { Loader2, PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler } from 'react-hook-form'
import type { infer as zodInfer } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { flowSchema } from '@/config/schemas'
import { useCustomForm } from '@/hooks'
import { useAddFlowMutation } from '@/store/api/flows/flows'
import type { FlowsAddData } from '@/store/api/flows/flows.types'
import { stopPropagation } from '@/utils/stop-events'

interface AddFlowDialogProps {
    categoryId: number
}

type FormData = zodInfer<typeof flowSchema>

export const AddFlowDialog: React.FC<AddFlowDialogProps> = ({ categoryId }) => {
    const form = useCustomForm(flowSchema, { name: '' })

    const [addFlow, { isLoading }] = useAddFlowMutation()

    const reset = () => {
        form.reset()
        setOpen(false)
    }

    const handleAddFlow = async (data: FlowsAddData) => {
        try {
            await addFlow(data).unwrap()
            reset()
        } catch {}
    }

    const onSubmit: SubmitHandler<FormData> = (formData) =>
        handleAddFlow({
            ...formData,
            category: categoryId
        })

    const [open, setOpen] = useState(false)

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={stopPropagation}
                    className='flex w-full items-center gap-x-1.5'
                    size='lg'>
                    <PlusCircleIcon width='16px' />
                    Add Flow
                </Button>
            </DialogTrigger>
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Add flow</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        method='POST'
                        className='mx-auto w-full space-y-5'
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Flow name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='flow'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            onClick={stopPropagation}
                            className='w-full'
                            type='submit'>
                            {isLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                'Add'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
