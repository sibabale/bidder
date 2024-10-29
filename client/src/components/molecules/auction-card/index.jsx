'use client'

import Link from 'next/link'
import Image from 'next/image'
import numeral from 'numeral'

export default function AuctionCard({ product }) {
    return (
        <Link
            href={`/auctions/${product.id}`}
            className="border hover:shadow transition"
        >
            <Image
                src={product.image}
                alt={product.title}
                width={300}
                height={200}
                className="object-cover w-full h-48"
            />
            <div className="p-4">
                <div className="border-b pb-[10px]">
                    <h2 className="text-xl font-semibold mt-2">
                        {product.title}
                    </h2>
                    <h3 className="text-sm text-bidder-secondary font-semibold mt-2">
                        Lorem ipsum
                    </h3>
                </div>
                <div className="mt-[10px]">
                    <small className="text-bidder-secondary">
                        Starting bid
                    </small>
                    <p className="text-black text-base font-bold mt-1">
                        R{numeral(product.startPrice).format('R0,0.00')}
                    </p>
                </div>
            </div>
        </Link>
    )
}
