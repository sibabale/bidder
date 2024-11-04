'use client'
import Link from 'next/link'

import Header from '../components/molecules/header/header'
import NorthEastArrowIcon from '../components/atoms/icons/north-east-arrow'

export default function Home() {
    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row-reverse items-center justify-between mt-10">
                    <img
                        data-sizes="auto"
                        data-src="/images/hero.png"
                        data-srcset="
                            /images/hero-320w.png 300w, 
                            /images/hero-425w.png 425w, 
                            /images/hero-768w.png 768w, 
                            /images/hero-1024w.png 1024w
                        "
                        className="lazyload w-full max-w-md mb-5 md:mb-0"
                        alt="Hero image for Biddar"
                        loading="lazy"
                    />
                    <div className="text-center md:text-left md:ml-6">
                        <h1 className="text-3xl font-bold">Curated</h1>
                        <h4 className="text-bidder-primary text-lg mt-1">
                            /kjʊəˈreɪtɪd,kjɔːˈreɪtɪd/
                        </h4>
                        <p className="mt-2 text-sm text-gray-400">
                            adjective (of online content, merchandise,
                            information, etc.) selected, organized, and
                            presented using professional or expert knowledge.
                        </p>
                    </div>
                </div>

                <div className="mt-10 w-full bg-gray-100 p-3 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <h4 className="text-xl font-semibold">Manzio</h4>
                        <Link
                            href="auth/login"
                            className="my-3 flex items-center md:flex-row outline-none cursor-pointer"
                        >
                            <span className="mr-2">See more</span>
                            <NorthEastArrowIcon />
                        </Link>
                    </div>

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <Link href="/auth/login">
                                <img
                                    key={num}
                                    data-sizes="auto"
                                    data-src={`/images/products/product-${num}.png`}
                                    data-srcset={`/images/products/product-${num}.png 300w`}
                                    className="lazyload w-full max-w-md"
                                    alt={`Product ${num} for Biddar`}
                                    loading="lazy"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
