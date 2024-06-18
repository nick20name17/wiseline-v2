import { type PropsWithChildren } from 'react'

import { PageLoader } from '@/components/ui/page-loader'
import { useGetUserQuery } from '@/store/api'

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { isLoading } = useGetUserQuery()

    if (isLoading) {
        return <PageLoader />
    }

    return children
}
