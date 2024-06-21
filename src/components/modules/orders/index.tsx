import React from 'react'

import { Button } from '@/components/ui/button'

export const Orders = () => {
    const [count, setCount] = React.useState(0)

    const increment = () => setCount(count + 1)

    return (
        <div className='flex h-screen items-center justify-center'>
            <Button onClick={increment}>Count: {count}</Button>
        </div>
    )
}
