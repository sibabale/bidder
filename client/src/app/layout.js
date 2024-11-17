import { Space_Grotesk } from 'next/font/google'
import dynamic from 'next/dynamic'
import ProtectedRoute from '../components/template/protectedRoute'

import './globals.css'

const StoreProvider = dynamic(() => import('./storeProvider'), {
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
            <head>
                <script
                    src="https://assets.complycube.com/web-sdk/v1/complycube.min.js"
                    async={false}
                ></script>
                <meta
                    name="referrer"
                    content="strict-origin-when-cross-origin"
                />
                <link
                    rel="stylesheet"
                    href="https://assets.complycube.com/web-sdk/v1/style.css"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        ComplyCube.mount({
                            token: ${process.env.NEXT_PUBLIC_COMPLYCUBE_TOKEN},
                            containerId: 'complycube-mount',
                            stages: [
                            'intro',
                            'documentCapture',
                            {
                                name: 'faceCapture',
                                options: {
                                mode: 'video'
                                }
                            },
                            'completion'
                            ],
                            onComplete: function(data) {
                                console.info('Capture complete')
                            },
                            onModalClose: function() {
                                // Handle the modal closure attempt
                            },
                            onError: function({ type, message }) {
                                if (type === 'token_expired') {
                                // Request a new SDK token
                            } else {
                                    console.error(message)
                                }
                            },
                        })
                    `,
                    }}
                />
            </head>
            <body className={spaceGrotesk.className}>
                <ProtectedRoute>
                    <StoreProvider>{children}</StoreProvider>
                </ProtectedRoute>
                <div id="complycube-mount"></div>
            </body>
        </html>
    )
}
