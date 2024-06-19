import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { Layout } from '@/components/layout'
import { routes } from '@/config/routes'
import { ErrorPage } from '@/pages/error-page'
import { HomePage } from '@/pages/home-page'
import { LoginPage } from '@/pages/login-page'
import { UsersPage } from '@/pages/users-page'
import { RequireAuthProvider } from '@/providers/require-auth-provider'

const router = createBrowserRouter([
    {
        path: routes.home,
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: (
                    <RequireAuthProvider>
                        <HomePage />
                    </RequireAuthProvider>
                )
            },
            {
                path: routes.users,
                element: (
                    <RequireAuthProvider>
                        <UsersPage />
                    </RequireAuthProvider>
                )
            },
            {
                path: routes.login,
                element: <LoginPage />
            }
        ]
    },
    {
        path: '*',
        element: <ErrorPage />
    }
])

export const App = () => <RouterProvider router={router} />
