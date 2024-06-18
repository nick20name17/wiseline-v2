import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import ReactDOM from 'react-dom/client'

import '@/assets/styles/global.css'
import { App } from '@/components/app'
import { Providers } from '@/providers'

if (process.env.NODE_ENV === 'production') {
    disableReactDevTools()
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Providers>
        <App />
    </Providers>
)
