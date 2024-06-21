import { Controls } from './controls'
import { columns } from './table/columns'
import { UsersTable } from './table/table'
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
