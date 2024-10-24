'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NextUIProvider } from '@nextui-org/react'
import { store, persistor } from '../lib/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function StoreProvider({ children }) {
    const queryClient = new QueryClient()

    const storeRef = useRef()
    if (!storeRef.current) {
        storeRef.current = store()
    }

    return (
        <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <NextUIProvider>{children}</NextUIProvider>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    )
}
