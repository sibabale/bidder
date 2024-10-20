'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from '../lib/store'
import { PersistGate } from 'redux-persist/integration/react'
import { NextUIProvider } from '@nextui-org/react'

export default function StoreProvider({ children }) {
    const storeRef = useRef()
    if (!storeRef.current) {
        storeRef.current = store()
    }

    return (
        <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={persistor}>
                <NextUIProvider>{children}</NextUIProvider>
            </PersistGate>
        </Provider>
    )
}
