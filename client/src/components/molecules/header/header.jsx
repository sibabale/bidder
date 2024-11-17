'use client'

import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'

import { logout } from '../../../lib/store/slices/user'
import Button from '../../atoms/button/button'
import MenuIcon from '../../atoms/icons/menu'
import CloseIcon from '../../atoms/icons/close'

export default function Header() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [menuOpen, setMenuOpen] = useState(false)

    const token = localStorage.getItem('biddar')
    const { error, mutateAsync, isPending } = useMutation({
        mutationFn: async () => {
            const BASE_URL = process.env.NEXT_PUBLIC_API_URL
            await axios.post(
                `${BASE_URL}/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            localStorage.removeItem('biddar')
            dispatch(logout())
            router.push('/auth/login')
        },
        onError: (error) => {
            console.error('Logout failed:', error)
        },
    })
    const toggleMenu = () => setMenuOpen(!menuOpen)

    return (
        <header className="bg-white shadow-md sticky top-0 z-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="text-2xl font-bold">
                        <Link
                            href="/"
                            className="flex items-center outline-none"
                        >
                            <div className="h-10 w-10 bg-bidder-primary rounded-full"></div>
                            <h1 className="ml-3 text-black">Biddar</h1>
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-6">
                        <Link href="/auctions">
                            <span className="text-gray-700 hover:text-bidder-primary">
                                Auctions
                            </span>
                        </Link>
                        <Link href="/feedback">
                            <span className="text-gray-700 hover:text-bidder-primary">
                                Feedback
                            </span>
                        </Link>
                    </div>

                    <div className="flex">
                        <Link
                            href={token ? '/auctions/create' : '/auth/login'}
                            className="hidden md:block bg-primary text-white px-4 py-2"
                        >
                            Sell
                        </Link>
                        {token && (
                            <Button
                                text="Logout"
                                onClick={mutateAsync}
                                disabled={isPending}
                                isLoading={isPending}
                                className="hidden shadow-none md:block bg-white cursor-pointer hover:bg-red-400 hover:text-white hover:shadow-md border border-red-400 text-red-400 px-4 py-2 ml-2"
                            />
                        )}
                    </div>

                    <div className="md:hidden ">
                        {!menuOpen ? (
                            <div onClick={toggleMenu}>
                                <MenuIcon className="h-6 w-6 cursor-pointer" />
                            </div>
                        ) : (
                            <div onClick={toggleMenu}>
                                <CloseIcon className="h-6 w-6 cursor-pointer" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-white shadow-md p-4 space-y-4">
                    <Link href="/auctions">
                        <span className="block mb-5 border-b  text-gray-700 hover:text-blue-600">
                            Auctions
                        </span>
                    </Link>
                    <Link href="/feedback" className="">
                        <span className="block mb-5 border-b  text-gray-700 hover:text-blue-600">
                            Feedback
                        </span>
                    </Link>
                    <Link href={token ? '/auctions/create' : '/auth/login'}>
                        <span className="block bg-primary text-white px-4 py-2 text-center">
                            Sell
                        </span>
                    </Link>
                    {token && (
                        <Button
                            text="Logout"
                            onClick={mutateAsync}
                            disabled={isPending}
                            isLoading={isPending}
                            className="block w-full bg-white hover:bg-red-400 border border-red-400 text-red-400 hover:text-white shadow-none mt-5 px-4 py-2 text-center"
                        />
                    )}
                </div>
            )}
        </header>
    )
}
