import { columns } from './columns'
import { Controls } from './controls'
import { UsersTable } from './table'
import { useGetAllUsersQuery } from '@/store/api/users/users'

export const Users = () => {
    const { data, isLoading } = useGetAllUsersQuery({})

    return (
        <div className='mx-auto pt-2'>
            <Controls />
            <UsersTable
                columns={columns}
                data={data! || []}
                isLoading={isLoading}
            />
        </div>
    )
}
