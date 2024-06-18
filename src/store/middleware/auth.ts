import { createListenerMiddleware } from '@reduxjs/toolkit'

import { api } from '@/store/api'

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
    matcher: api.endpoints.login.matchFulfilled,
    effect: async (action, listenerApi) => {
        listenerApi.cancelActiveListeners()

        if (action.payload.refresh) {
            localStorage.setItem(
                'token',
                JSON.stringify({ refresh: action.payload.refresh })
            )
        }
    }
})
