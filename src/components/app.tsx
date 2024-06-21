import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { Layout } from '@/components/layout'
import { routes } from '@/config/routes'
import {
    CalendarPage,
    CompanySettingsPage,
    ErrorPage,
    FlowSettingsPage,
    LoginPage,
    OrdersPage,
    RequireAuthProvider,
    UserSettingsPage,
    UsersPage
} from '@/pages'

const router = createBrowserRouter([
    {
        path: routes.orders,
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: (
                    <RequireAuthProvider>
                        <OrdersPage />
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
