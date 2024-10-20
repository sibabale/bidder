export default function Home() {
    return (
        <>
            {/* <Header /> */}
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold">Welcome to Bidder</h1>
                <p className="mt-4 text-gray-700">
                    Join live auctions and place your bids in real-time.
                </p>
                <div className="mt-6 space-x-4">
                    <a
                        href="/auctions"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Explore Auctions
                    </a>
                    <a
                        href="/login"
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded"
                    >
                        Login
                    </a>
                </div>
            </div>
        </>
    )
}
