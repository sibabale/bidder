'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_BEARER_API_URL

export const useSocket = () => {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const newSocket = io(SOCKET_URL)
        setSocket(newSocket)

        return () => {
            // Cleanup on unmount
            newSocket.disconnect()
        }
    }, [])

    return socket
}
