'use client'

import { useEffect, useState } from 'react'
import AuctionCard from '../../components/molecules/auction-card'

export default function AuctionsPage() {
    const [auctions, setAuctions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('biddar')
        const basURL = process.env.NEXT_PUBLIC_API_URL

        const fetchAuctions = async () => {
            try {
                const response = await fetch(`${basURL}/products`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) throw new Error('Failed to fetch auctions')
                const data = await response.json()
                setAuctions(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAuctions()
    }, [])

    if (loading) return <p className="text-center mt-10">Loading auctions...</p>
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold mb-6">Auctions</h1>
            <div
                className="
                grid gap-6 
                grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-4 
                xl:grid-cols-5
             "
            >
                {auctions.map((auction) => (
                    <AuctionCard key={auction.id} product={auction} />
                ))}
            </div>
        </div>
    )
}
