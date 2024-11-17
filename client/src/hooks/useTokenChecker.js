import axios from 'axios'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

const useTokenChecker = () => {
    const router = useRouter()
    const pathname = usePathname()

    const publicAuthRoutes = [
        '/',
        '/auth/login',
        '/auth/register',
        '/auth/reset-password',
    ]

    const isTokenExpired = (token) => {
        if (!token) return true
        const decoded = jwtDecode(token)
        const expirationTime = decoded.exp * 1000
        const twoMinutesBeforeExpiration = expirationTime - 2 * 60 * 1000
        return twoMinutesBeforeExpiration < Date.now()
    }

    const logout = async () => {
        const token = await localStorage.getItem('biddar')
        if (!token) return

        const baseURL = process.env.NEXT_PUBLIC_API_URL
        try {
            await axios.post(
                `${baseURL}/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            localStorage.removeItem('biddar')
            router.replace('/auth/login')
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    useEffect(() => {
        if (publicAuthRoutes.includes(pathname)) {
            return
        }
        const interval = setInterval(() => {
            const token = localStorage.getItem('biddar')
            if (isTokenExpired(token)) {
                logout()
            }
        }, 60000)

        return () => clearInterval(interval)
    }, [router, pathname])
}

export default useTokenChecker
