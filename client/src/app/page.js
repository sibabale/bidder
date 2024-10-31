export default function Home() {
    return (
        <>
            {/* <Header /> */}
            <div className="p-3 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold">Welcome to Biddar</h1>
                <p className="mt-4 text-gray-700">
                    Join live auctions and place your bids in real-time.
                </p>
                <div className="mt-6 space-x-4 flex flex-col md:flex-row items-center justify-center">
                    <a
                        href="/auth/login"
                        className="px-4 py-2 bg-bidder-primary text-white"
                    >
                        Explore Auctions
                    </a>
                    <a
                        href="/auth/login"
                        className="px-4 mt-5 md:mt-0 py-2 border border-bidder-bg-bidder-primary text-bidder-bg-bidder-primary"
                    >
                        Login
                    </a>
                </div>
            </div>
        </>
    )
}
