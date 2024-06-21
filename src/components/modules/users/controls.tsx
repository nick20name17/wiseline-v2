import { AddUserDialog } from './actions/add-user-dialog'
import { SearchBar } from '@/components/shared'

export const Controls = () => {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <SearchBar />
            <AddUserDialog />
        </div>
    )
}
