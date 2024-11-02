import axios from 'axios'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

const useTokenChecker = () => {
    const router = useRouter()

    const isTokenExpired = (token) => {
        if (!token) return true
        const decoded = jwtDecode(token)
        const expirationTime = decoded.exp * 1000
        const twoMinutesBeforeExpiration = expirationTime - 2 * 60 * 1000
        return twoMinutesBeforeExpiration < Date.now()
    }

    const logout = async () => {
        const token = localStorage.getItem('biddar')
        const baseURL = process.env.NEXT_PUBLIC_BEARER_API_URL
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
        const token = localStorage.getItem('biddar')
        if (isTokenExpired(token)) {
            localStorage.removeItem('biddar')
            logout()
        }

        const interval = setInterval(() => {
            const token = localStorage.getItem('biddar')
            if (isTokenExpired(token)) {
                localStorage.removeItem('biddar')
                logout()
            }
        }, 60000)

        return () => clearInterval(interval)
    }, [router])
}

export default useTokenChecker
