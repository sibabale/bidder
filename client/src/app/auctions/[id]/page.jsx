'use client'

import Image from 'next/image'
import numeral from 'numeral'
import { useQuery } from '@tanstack/react-query'
import { useSocket } from '../../../hooks/useSocket'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '../../../components/ui/button'
import CountdownTimer from '../../../components/molecules/bidding-counter'
import ProductDetails from '../../../components/organisms/product-details/product-details'
import { loggedInUser } from '../../../lib/store/selectors/user'

export default function DetailsPage({ params }) {
    const [bids, setBids] = useState([])
    const [activeTab, setActiveTab] = useState('description')
    const [currentBid, setCurrentBid] = useState()
    const [biddingPrice, setBiddingPrice] = useState()

    const user = useSelector(loggedInUser)

    const { id } = params

    const token = localStorage.getItem('biddar')
    const baseURL = process.env.NEXT_PUBLIC_API_URL

    async function fetchProductDetails(id) {
        const response = await fetch(`${baseURL}/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) throw new Error('Failed to fetch product')

        return response.json()
    }

    const { data, error, isError, isPending } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductDetails(id),
        enabled: !!id,
    })

    const channel = useSocket(`auction-${id}`)

    useEffect(() => {
        if (data?.highestBid) {
            setCurrentBid(data?.highestBid)
            setBiddingPrice(data?.highestBid)
        }
    }, [data])

    useEffect(() => {
        if (!channel) return

        // Listen for new bids
        channel.subscribe('new_bid', (message) => {
            const bid = message.data
            setBids((prevBids) => [...prevBids, bid])
            setCurrentBid(bid.amount)
            setBiddingPrice(bid.amount)
        })

        // Cleanup when component unmounts
        return () => {
            channel.unsubscribe()
        }
    }, [channel])

    const handleBidSubmit = async (e) => {
        e.preventDefault()

        // Construct the bid object
        const bidData = {
            userId: user.userId, // Get this from your auth context or state
            amount: Number(biddingPrice),
            productId: id,
        }

        try {
            // Make an HTTP POST request to your REST API
            const response = await fetch(`${baseURL}/bids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bidData),
            })

            // Emit a WebSocket event if the bid was successful
            if (response.status === 201) {
                channel.publish('new_bid', bidData) // Notify others
            }
        } catch (error) {
            console.error('Error placing bid:', error)
        }
    }

    const increaseBid = () => {
        setBiddingPrice((prev) => prev + 10)
    }

    const decreaseBid = () => {
        setBiddingPrice((prev) =>
            prev > data.highestBid ? prev - 10 : data.highestBid
        )
    }

    if (isPending)
        return <p className="text-center mt-10">Loading product details...</p>
    if (isError)
        return <p className="text-center text-red-500 mt-10">{error.message}</p>

    if (!data) return null

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full h-auto relative overflow-hidden">
                    <Image
                        src={data.image}
                        alt={data.title}
                        width={1200}
                        height={600}
                        className="object-cover w-full h-[300px] md:h-[500px] lg:h-[600px]"
                    />
                </div>

                <div className="p-4">
                    <div className="border-b pb-4">
                        <div className="flex items-center justify-between flex-wrap">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mt-4">
                                {data.title}
                            </h1>

                            {data.status === 'live' ? (
                                <div className="flex items-center mt-4">
                                    <span className="mr-3">Live</span>
                                    <div className="w-5 h-5 flex items-center justify-center rounded-full animate-pulse bg-red-300">
                                        <div className="w-3 h-3 rounded-full animate-pulse bg-red-500"></div>
                                    </div>
                                </div>
                            ) : data.status === 'closed' ? (
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
                            {data.subTitle}
                        </h3>
                    </div>

                    <ProductDetails
                        frame={data?.frame}
                        medium={data?.medium}
                        signature={data?.signature}
                        dimensions={data?.dimensions}
                        certificate={data?.certificate}
                    />
                    <div className="mt-6">
                        <small className="text-gray-500">
                            {data.status === 'closed' ||
                            data.status === 'cancelled'
                                ? 'Closing Bid'
                                : data.startPrice >= data.highestBid
                                  ? 'Starting Bid'
                                  : 'Current Bid'}
                        </small>
                        <p className="text-2xl md:text-3xl lg:text-2xl text-black font-bold mt-1">
                            R{numeral(currentBid).format('R0,0.00')}{' '}
                        </p>
                    </div>

                    {data.status === 'live' && (
                        <div className="flex items-center justify-between mt-4">
                            <button
                                className="text-2xl border h-10 w-10 rounded-full"
                                onClick={decreaseBid}
                            >
                                -
                            </button>
                            <p className="text-lg md:text-xl lg:text-2xl">
                                R{numeral(biddingPrice).format('R0,0.00')}{' '}
                            </p>
                            <button
                                className="text-2xl border h-10 w-10 rounded-full"
                                onClick={increaseBid}
                            >
                                +
                            </button>
                        </div>
                    )}

                    {data.status !== 'live' && <hr className="mt-5" />}

                    {data.status !== 'live' && (
                        <CountdownTimer
                            status={data.status}
                            endTime={data.endTime}
                            startTime={data.startTime}
                        />
                    )}

                    {data.status === 'live' && (
                        <Button
                            onClick={handleBidSubmit}
                            className="mt-6 w-full bg-bidder-primary cursor-pointer text-white py-3 hover:bg-bidder-primary/70"
                        >
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

                        <AnimatePresence>
                            {activeTab === 'description' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="mt-4 text-sm md:text-base text-gray-600">
                                        {data.description}
                                    </p>
                                </motion.div>
                            )}

                            {activeTab === 'seller' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="font-bold">Coming soon</h3>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Bids History */}
            {/* <div className="mt-6">
                <h2 className="text-lg font-semibold">Bids History</h2>
                <ul className="mt-4 space-y-2">
                    {bids.map((bid, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{bid.userId}</span>
                            <span>
                                R{numeral(bid.amount).format('R0,0.00')}
                            </span>
                        </li>
                    ))}
                </ul>
            </div> */}
        </div>
    )
}
