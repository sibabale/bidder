import React from 'react';
import NguniBull from '../../../assests/images/nguni-bull.jpg';
import Button from '../../atoms/button';
import { Link } from 'react-router-dom';
export default function Welcome() {
    return (
        <div className="p-3 md:p-5 flex flex-col lg:flex-row-reverse md:justify-between">
            <div className="lg:w-2/3 xl:w-1/2">
                <img src={NguniBull} alt="" className="lg:pl-5 w-full" />
            </div>
            <div className="flex flex-col justify-between xl:p-20">
                <div className="">
                    <h1 className="text-4xl font-bold lg:mb-10">Serious Buyers</h1>
                    <h1 className="text-5xl font-bold">Verified Sellers</h1>
                    <p className="text-lg mt-5">
                        We connect serious buyers with verified sellers. We provide a platform for
                        buyers and sellers to meet and transact with ease.
                    </p>
                </div>
                <div className="mt-5 lg:py-10">
                    <Link to="/auctions" className="p-3 border border-primary">
                        <span className="text-primary">Browse Auctions</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
