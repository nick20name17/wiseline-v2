import { Edit2Icon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler } from 'react-hook-form'
import type { infer as zodInfer } from 'zod'

import { Button } from '../../ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../../ui/form'
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs'
import { Textarea } from '../../ui/textarea'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { stagesColorPresets } from '@/config/flows'
import { stageSchema } from '@/config/schemas'
import { useCustomForm } from '@/hooks/use-custom-form'
import { usePatchStageMutation } from '@/store/api/stages/stages'
import type { StagesPatchData } from '@/store/api/stages/stages.types'
import { stopPropagation } from '@/utils/stop-events'

interface Props {
    id: number
    name: string
    description: string
    color: string
}

type FormData = zodInfer<typeof stageSchema>

export const EditStatusDialog: React.FC<Props> = ({ id, name, description, color }) => {
    const form = useCustomForm(stageSchema, { name, description: description || '' })

    const [open, setOpen] = useState(false)

    const [colorValue, setColorValue] = useState(color)

    const [editStage, { isLoading }] = usePatchStageMutation()

    const reset = () => {
        form.reset()
        setOpen(false)
    }

    const handleEditStage = async (data: StagesPatchData) => {
        try {
            await editStage(data).unwrap()
            reset()
        } catch (error) {}
    }

    const onSubmit: SubmitHandler<FormData> = (formData) => {
        handleEditStage({
            id,
            data: {
                ...formData,
                color: colorValue
            }
        })
    }

    const onValueChange = (value: string) => setColorValue(value)

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
                    <Edit2Icon className='mr-2 h-3.5 w-3.5' />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Edit status</DialogTitle>
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
                                    <FormLabel>Stage name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='done'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stage description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className='resize-none'
                                            placeholder='Enter status description'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Tabs
                            onValueChange={onValueChange}
                            defaultValue={color}>
                            <TabsList className='gap-x-2 bg-transparent p-0'>
                                {stagesColorPresets.map((color) => (
                                    <TabsTrigger
                                        key={color}
                                        value={color}
                                        className='h-6 w-6 rounded-sm data-[state=active]:outline data-[state=active]:outline-offset-2'
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </TabsList>
                        </Tabs>

                        <Button
                            onClick={stopPropagation}
                            className='w-full'
                            type='submit'>
                            {isLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                'Edit'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}