'use client'

import TimerIcon from '../../../components/atoms/icons/timer'
import { Button } from '../../../components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import numeral from 'numeral' // Import numeral.js

export default function DetailsPage({ params }) {
    const [error, setError] = useState(null)
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('description')

    const { id } = params

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return
            const token = process.env.NEXT_PUBLIC_BEARER_API_TOKEN

            try {
                const response = await fetch(
                    `http://localhost:3000/api/products/${id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (!response.ok) throw new Error('Failed to fetch product')

                const data = await response.json()
                setProduct(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    if (loading)
        return <p className="text-center mt-10">Loading product details...</p>
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

    if (!product) return null

    const calculateRemainingTime = (endTime) => {
        const now = new Date()
        const end = new Date(endTime)
        const remaining = end - now

        if (remaining < 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }

        const seconds = Math.floor((remaining / 1000) % 60)
        const minutes = Math.floor((remaining / 1000 / 60) % 60)
        const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24)
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24))

        return { days, hours, minutes, seconds }
    }

    const CountdownTimer = ({ endTime }) => {
        const [timeLeft, setTimeLeft] = useState(
            calculateRemainingTime(endTime)
        )

        useEffect(() => {
            const timerId = setInterval(() => {
                setTimeLeft(calculateRemainingTime(endTime))
            }, 1000)

            return () => clearInterval(timerId)
        }, [endTime])

        if (
            timeLeft.days === 0 &&
            timeLeft.hours === 0 &&
            timeLeft.minutes === 0 &&
            timeLeft.seconds === 0
        ) {
            return <p className="text-red-600">Time is up!</p>
        }

        return (
            <div className="mt-5">
                <div className="flex items-center">
                    <TimerIcon />
                    <span className="ml-2 text-red-600">Time remaining:</span>
                </div>
                <div className="flex space-x-4 mt-2">
                    {timeLeft.days > 0 && (
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold">
                                {timeLeft.days}
                            </span>
                            <span className="text-sm text-gray-500">Days</span>
                        </div>
                    )}
                    {timeLeft.hours > 0 && (
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold">
                                {timeLeft.hours}
                            </span>
                            <span className="text-sm text-gray-500">Hours</span>
                        </div>
                    )}
                    {timeLeft.minutes > 0 && (
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold">
                                {timeLeft.minutes}
                            </span>
                            <span className="text-sm text-gray-500">
                                Minutes
                            </span>
                        </div>
                    )}
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">
                            {timeLeft.seconds}
                        </span>
                        <span className="text-sm text-gray-500">Seconds</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full h-auto relative overflow-hidden">
                    <Image
                        src={product.image}
                        alt={product.title}
                        width={1200}
                        height={600}
                        className="object-cover w-full h-[300px] md:h-[500px] lg:h-[600px]"
                    />
                </div>

                <div className="p-4">
                    <div className="border-b pb-4">
                        <div className="flex items-center justify-between flex-wrap">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mt-4">
                                {product.title}
                            </h1>

                            {product.status === 'live' ? (
                                <div className="flex items-center mt-4">
                                    <span className="mr-3">Live</span>
                                    <div className="w-5 h-5 flex items-center justify-center rounded-full animate-pulse bg-red-300">
                                        <div className="w-3 h-3 rounded-full animate-pulse bg-red-500"></div>
                                    </div>
                                </div>
                            ) : product.status === 'closed' ? (
                                <div className="px-2 mt-4 h-fit bg-red-600 text-white rounded-full">
                                    Closed
                                </div>
                            ) : (
                                <small className="h-fit px-2 mt-4 bg-green-500 text-white rounded-full">
                                    Coming Soon
                                </small>
                            )}
                        </div>
                        <h3 className="text-sm md:text-base text-gray-500 font-semibold mt-2">
                            Lorem ipsum dolor sit amet
                        </h3>
                    </div>

                    <div className="mt-6">
                        <small className="text-gray-500">Starting bid</small>
                        <p className="text-2xl md:text-3xl lg:text-2xl text-black font-bold mt-1">
                            R{numeral(product.startPrice).format('R0,0.00')}{' '}
                            {/* Format with numeral */}
                        </p>
                    </div>

                    {product.status === 'live' && (
                        <div className="flex items-center justify-between mt-4">
                            <button className="text-2xl border h-10 w-10 rounded-full">
                                -
                            </button>
                            <p className="text-lg md:text-xl lg:text-2xl">
                                R{numeral(product.startPrice).format('R0,0.00')}{' '}
                                {/* Format with numeral */}
                            </p>
                            <button className="text-2xl border h-10 w-10 rounded-full">
                                +
                            </button>
                        </div>
                    )}

                    {product.status !== 'live' && <hr className="mt-5" />}

                    {product.endTime && (
                        <CountdownTimer endTime={product.endTime} />
                    )}

                    {product.status === 'live' && (
                        <Button className="mt-6 w-full bg-bidder-primary cursor-pointer text-white py-3 hover:bg-bidder-primary/70">
                            Place a bid
                        </Button>
                    )}

                    <div className="mt-6 space-y-4">
                        <div className="flex">
                            <div
                                className={`w-fit mr-2 px-2 cursor-pointer transition-all duration-300 ${
                                    activeTab === 'description'
                                        ? 'bg-bidder-primary/40'
                                        : ''
                                } border-b-2 border-b-bidder-primary`}
                                onClick={() => setActiveTab('description')}
                            >
                                <h3 className="text-black">Description</h3>
                            </div>

                            <div
                                className={`w-fit px-2 cursor-pointer transition-all duration-300 ${
                                    activeTab === 'seller'
                                        ? 'bg-bidder-primary/40'
                                        : ''
                                } border-b-2 border-b-bidder-primary`}
                                onClick={() => setActiveTab('seller')}
                            >
                                <h3 className="text-black">Seller</h3>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="border p-5 rounded-md"
                            >
                                {activeTab === 'description' ? (
                                    <p>{product.description}</p>
                                ) : (
                                    <p>{product.seller}</p>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
