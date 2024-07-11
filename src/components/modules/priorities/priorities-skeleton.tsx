import { Skeleton } from '@/components/ui/skeleton'

export const PrioritiesSkeleton = () => (
    <div className='mt-4 flex flex-col gap-y-2'>
        {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
                key={index}
                className='mt-1 h-20 w-full'
            />
        ))}
    </div>
)
