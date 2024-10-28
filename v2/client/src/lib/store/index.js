// 'use client'
// import storage from 'redux-persist/lib/storage'
// import { persistStore, persistReducer } from 'redux-persist'
// import { configureStore, combineReducers } from '@reduxjs/toolkit'

// import userReducer from './slices/user/index.js'

// const persistConfig = {
//     key: 'root',
//     storage,
//     whitelist: ['user', 'cart', 'orders'],
// }

// const rootReducer = combineReducers({
//     user: userReducer,
// })

// const persistedReducer = persistReducer(persistConfig, rootReducer)

// const store = () => {
//     return configureStore({
//         reducer: persistedReducer,
//         middleware: (getDefaultMiddleware) =>
//             getDefaultMiddleware({
//                 serializableCheck: false,
//             }),
//     })
// }

// const persistor = persistStore(store())

// export { store, persistor }

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import userReducer from './slices/user/index.js'

const persistConfig = {
    key: 'persist',
    storage,
}

const rootReducer = combineReducers({
    user: userReducer,
})

const makeConfiguredStore = () =>
    configureStore({
        reducer: rootReducer,
    })

export const store = () => {
    const isServer = typeof window === 'undefined'
    if (isServer) {
        return makeConfiguredStore()
    } else {
        const persistedReducer = persistReducer(persistConfig, rootReducer)
        let store = configureStore({
            reducer: persistedReducer,
        })
        store.__persistor = persistStore(store)
        return store
    }
}
