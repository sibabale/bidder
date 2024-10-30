import axios from 'axios'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

const useTokenChecker = () => {
    const router = useRouter()
    const token = localStorage.getItem('biddar')
    const isTokenExpired = (token) => {
        if (!token) return true
        const decoded = jwtDecode(token)
        const expirationTime = decoded.exp * 1000
        const twoMinutesBeforeExpiration = expirationTime - 2 * 60 * 1000
        return twoMinutesBeforeExpiration < Date.now()
    }
    const logout = async (token) => {
        const baseURL = process.env.NEXT_PUBLIC_BEARER_API_URL
        try {
            await axios.post(
                `${baseURL}/auth/logout`,
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
            console.error(error)
        }
    }
    useEffect(() => {
        if (isTokenExpired(token)) {
            logout(token)
        }
        const interval = setInterval(() => {
            if (isTokenExpired(token)) {
                logout(token) // Make sure to pass the token to logout
            }
        }, 60000) // Check every minute
        return () => clearInterval(interval) // Cleanup on unmount
    }, [router])
}

export default useTokenChecker
