import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import type { Message } from '@/types/common'

export const ErrorPage: React.FC<Message> = ({ message = 'Page not found' }) => {
    const navigate = useNavigate()
    const onClick = () => navigate('/')

    return (
        <div className='flex min-h-[100vh] items-center justify-center'>
            <div className='flex flex-col items-center gap-y-5'>
                <h1 className='text-center text-5xl'>{message}</h1>
                <Button onClick={onClick}>Go to homepage</Button>
            </div>
        </div>
    )
}
