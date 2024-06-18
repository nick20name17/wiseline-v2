import { type PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { store } from '@/store'

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <ThemeProvider
            defaultTheme='system'
            storageKey='vite-ui-theme'>
            <Provider store={store}>
                <AuthProvider>{children}</AuthProvider>
            </Provider>
        </ThemeProvider>
    )
}
