import { format } from 'date-fns'
import { Loader2, PlusCircleIcon, Send } from 'lucide-react'
import { type SubmitHandler } from 'react-hook-form'
import { StringParam, useQueryParam } from 'use-query-params'
import type { infer as zodInfer } from 'zod'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { commentSchema } from '@/config/schemas'
import { useCustomForm } from '@/hooks'
import {
    useAddItemCommentMutation,
    useAddOrderCommentMutation
} from '@/store/api/comments/comments'
import type { OriginItems } from '@/store/api/ebms/ebms.types'
import { useAppSelector } from '@/store/hooks/hooks'
import { selectUser } from '@/store/slices/auth'
import { getUpperCaseInitials } from '@/utils'

interface CommentsSidebarProps {
    originItem: OriginItems
}
type FormData = zodInfer<typeof commentSchema>

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({ originItem }) => {
    const [category] = useQueryParam('category', StringParam)

    const originItemId = originItem?.id
    const originOrderId = originItem?.origin_order
    const comments = originItem?.item?.comments

    const form = useCustomForm(commentSchema, { text: '' })

    const userId = useAppSelector(selectUser)?.id

    const [addOrderComments, { isLoading: isOrderLoading }] = useAddOrderCommentMutation()
    const [addItemComments, { isLoading: isItemLoading }] = useAddItemCommentMutation()

    const inputValue = form.watch('text')

    const handleAddComments = async (text: string) => {
        form.reset()

        const handleFunction = category === 'All' ? addOrderComments : addItemComments

        try {
            await handleFunction({
                order: originOrderId,
                item: originItemId,
                user: userId!,
                text
            }).unwrap()
        } catch (error) {}
    }

    const onSubmit: SubmitHandler<FormData> = (formData) =>
        handleAddComments(formData.text.trim())

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className='!w-32'
                    variant='outline'>
                    {comments?.length ? (
                        <div className='flex w-full items-center justify-center gap-x-10'>
                            Notes <Badge>{comments?.length}</Badge>
                        </div>
                    ) : (
                        <>
                            <PlusCircleIcon className='mr-1 h-4 w-4' />
                            Add note
                        </>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className='p-5'>
                <SheetHeader>
                    <SheetTitle>Notes</SheetTitle>
                </SheetHeader>
                {comments?.length ? (
                    <ScrollArea className='h-[85vh] pr-3'>
                        <div className='flex flex-col justify-center gap-y-3 py-4'>
                            {comments.map((note) => (
                                <Card key={note.id}>
                                    <CardHeader className='px-4 pb-2 pt-4'>
                                        <div className='flex items-center gap-x-2'>
                                            <Avatar>
                                                <AvatarFallback>
                                                    {getUpperCaseInitials(
                                                        `${note.user.first_name} ${note.user.last_name}`
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className='text-[16px] font-medium'>
                                                    {note.user.email}
                                                </CardTitle>
                                                <CardDescription>
                                                    {format(
                                                        note.created_at,
                                                        'dd.MM.yyyy'
                                                    )}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='px-4 pb-4 pt-2'>
                                        <p>{note.text}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className='flex h-full flex-col items-center justify-center gap-4 py-4'>
                        Your notes will appear here
                    </div>
                )}

                <SheetFooter className='absolute bottom-0 left-0 right-0 h-20 w-full p-4'>
                    <Form {...form}>
                        <form
                            className='relative flex w-full items-center justify-between gap-x-1'
                            autoComplete='off'
                            onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name='text'
                                render={({ field }) => (
                                    <FormItem className='h-full w-full flex-1'>
                                        <FormControl>
                                            <Input
                                                className='h-full w-full'
                                                placeholder='Leave your note here...'
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={isItemLoading || isOrderLoading || !inputValue}
                                size='icon'
                                className='absolute right-1.5 top-1/2 h-[calc(100%-10px)] -translate-y-1/2 transition-all'
                                type='submit'>
                                {isItemLoading || isOrderLoading ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                ) : (
                                    <Send className='h-5 w-5' />
                                )}
                            </Button>
                        </form>
                    </Form>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
