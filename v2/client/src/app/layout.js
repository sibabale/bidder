import { Space_Grotesk } from 'next/font/google'
import StoreProvider from '../app/storeProvider'

import './globals.css'
const spaceGrotesk = Space_Grotesk({
    style: ['normal'],
    weights: [300, 400, 500, 600, 700],
    subsets: ['latin'],
})

export const metadata = {
    title: 'Bidder',
    description: 'Online bidding platform',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={spaceGrotesk.className}>
                <StoreProvider>{children}</StoreProvider>
            </body>
        </html>
    )
}
