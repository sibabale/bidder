'use client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Ably from 'ably'
import { AblyProvider, ChannelProvider } from 'ably/react'

import { store, persistor } from '../lib/store'
import useTokenChecker from '../hooks/useTokenChecker'

export default function StoreProvider({ children }) {
    const token = localStorage.getItem('biddar')
    if (token) {
        useTokenChecker()
    }
    const queryClient = new QueryClient()
    const client = new Ably.Realtime({
        authUrl: '/api/createTokenRequest',
    })

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <AblyProvider client={client}>
                        <ChannelProvider channelName="biddar">
                            <NextUIProvider>{children}</NextUIProvider>
                        </ChannelProvider>
                    </AblyProvider>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    )
}
