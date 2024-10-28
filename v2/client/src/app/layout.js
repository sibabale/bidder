import { Space_Grotesk } from 'next/font/google'
import dynamic from 'next/dynamic'
import ProtectedRoute from '../components/template/protectedRoute'

import './globals.css'

const StoreProvider = dynamic(() => import('../app/storeProvider'), {
    ssr: false,
})

const spaceGrotesk = Space_Grotesk({
    style: ['normal'],
    weights: [300, 400, 500, 600, 700],
    subsets: ['latin'],
})

export const metadata = {
    title: 'Biddar',
    description: 'Online bidding platform',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={spaceGrotesk.className}>
                <ProtectedRoute>
                    <StoreProvider>{children}</StoreProvider>
                </ProtectedRoute>
            </body>
        </html>
    )
}
