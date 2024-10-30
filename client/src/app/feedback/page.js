import Link from 'next/link'
import React from 'react'

const FeedbackPage = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl">Coming soon</h1>
            <Link
                href="/auctions"
                className="p-3 mt-5 bg-bidder-primary text-white"
            >
                View auctions
            </Link>
        </div>
    )
}

export default FeedbackPage
