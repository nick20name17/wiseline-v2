import { SearchBar } from '../shared'

import { AddUserDialog } from './actions/add-user-dialog'

export const Controls = () => {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <SearchBar />
            <AddUserDialog />
        </div>
    )
}
