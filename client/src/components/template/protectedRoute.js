'use client'
import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const ProtectedRoute = ({ children }) => {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const token = localStorage.getItem('biddar')

        const authRoutes = [
            '/',
            '/auth/login',
            '/auth/register',
            '/auth/reset-password',
        ]

        if (token && authRoutes.includes(pathname)) {
            router.replace('/auctions')
        } else if (!token && !authRoutes.includes(pathname)) {
            router.replace('/auth/login')
        }
    }, [pathname, router])

    return <>{children}</>
}

export default ProtectedRoute
