import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import { Head } from '@/components/head'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/sonner'
import { ErrorPage } from '@/pages/error-page'
import { useAppSelector } from '@/store/hooks/hooks'
import { selectIsAuth } from '@/store/slices/auth'

export const Layout = () => {
    const isAuth = useAppSelector(selectIsAuth)

    return (
        <QueryParamProvider
            adapter={ReactRouter6Adapter}
            options={{
                updateType: 'replaceIn'
            }}>
            <Head />
            {!isAuth ? <Header /> : null}
            <main>
                <ErrorBoundary fallback={<ErrorPage message='Something went wrong' />}>
                    <div className='container mx-auto'>
                        <Outlet />
                    </div>
                </ErrorBoundary>
            </main>
            <Toaster
                richColors
                duration={5000}
            />
        </QueryParamProvider>
    )
}
