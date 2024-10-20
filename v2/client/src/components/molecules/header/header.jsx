'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../../ui/button'
import MenuIcon from '../../atoms/icons/menu'
import CloseIcon from '../../atoms/icons/close'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => setMenuOpen(!menuOpen)

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="text-2xl font-bold">
                        <Link href="/" className="flex items-center">
                            <div className="h-10 w-10 bg-bidder-primary rounded-full"></div>
                            <h1 className="ml-3 text-black">Bidder</h1>
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-6">
                        <Link href="/auctions">
                            <span className="text-gray-700 hover:text-blue-600">
                                Auctions
                            </span>
                        </Link>
                        <Link href="/insights">
                            <span className="text-gray-700 hover:text-blue-600">
                                Insights
                            </span>
                        </Link>
                    </div>

                    <Button
                        asChild
                        className="hidden md:block bg-primary text-white px-4 py-2"
                    >
                        <Link href="/sell">Sell</Link>
                    </Button>

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
                    <Link href="/insights" className="">
                        <span className="block mb-5 border-b  text-gray-700 hover:text-blue-600">
                            Insights
                        </span>
                    </Link>
                    <Link href="/sell">
                        <span className="block bg-primary text-white px-4 py-2 text-center">
                            Sell
                        </span>
                    </Link>
                </div>
            )}
        </header>
    )
}
