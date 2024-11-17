'use client'
import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const PUBLIC_ROUTES = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
]

const ProtectedRoute = ({ children }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('biddar')
                const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

                // Case 1: User is authenticated but trying to access public routes
                if (token && isPublicRoute) {
                    router.replace('/auctions')
                    return
                }

                // Case 2: User is not authenticated and trying to access protected routes
                if (!token && !isPublicRoute) {
                    router.replace('/auth/login')
                    return
                }

                // Case 3: User is authenticated and accessing protected routes
                if (token && !isPublicRoute) {
                    setIsAuthenticated(true)
                }

                // Case 4: User is not authenticated and accessing public routes
                if (!token && isPublicRoute) {
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error('Auth check failed:', error)
                router.replace('/auth/login')
            } finally {
                setIsLoading(false)
            }
        }

        // Initial auth check
        checkAuth()

        // Set up storage event listener for token changes
        const handleStorageChange = (e) => {
            if (e.key === 'biddar') {
                checkAuth()
            }
        }
        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [pathname, router])

    // Show nothing while checking authentication
    if (isLoading) {
        return null
    }

    // For protected routes, only render when authenticated
    if (!PUBLIC_ROUTES.includes(pathname) && !isAuthenticated) {
        return null
    }

    return <>{children}</>
}

export default ProtectedRoute
