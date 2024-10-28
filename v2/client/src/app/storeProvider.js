'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { store } from '../lib/store'
import useTokenChecker from '../hooks/useTokenChecker'

export default function StoreProvider({ children }) {
    useTokenChecker()
    const queryClient = new QueryClient()

    const storeRef = useRef()
    if (!storeRef.current) {
        storeRef.current = store()
    }

    return (
        <Provider store={storeRef.current}>
            <PersistGate
                loading={null}
                persistor={storeRef.current.__persistor}
            >
                <QueryClientProvider client={queryClient}>
                    <NextUIProvider>{children}</NextUIProvider>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    )
}
