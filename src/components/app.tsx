import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { Layout } from '@/components/layout'
import { routes } from '@/config/routes'
import { CalendarPage } from '@/pages/calendar-page'
import { CompanySettingsPage } from '@/pages/company-settings'
import { ErrorPage } from '@/pages/error-page'
import { FlowSettingsPage } from '@/pages/flow-settings-page'
import { HomePage } from '@/pages/home-page'
import { LoginPage } from '@/pages/login-page'
import { UserSettingsPage } from '@/pages/user-settings-page'
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
                path: routes.companySettings,
                element: (
                    <RequireAuthProvider>
                        <CompanySettingsPage />
                    </RequireAuthProvider>
                )
            },
            {
                path: routes.userSettings,
                element: (
                    <RequireAuthProvider>
                        <UserSettingsPage />
                    </RequireAuthProvider>
                )
            },
            {
                path: routes.calendar,
                element: (
                    <RequireAuthProvider>
                        <CalendarPage />
                    </RequireAuthProvider>
                )
            },
            {
                path: routes.flowSettings,
                element: (
                    <RequireAuthProvider>
                        <FlowSettingsPage />
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
