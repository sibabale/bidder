// src/components/Auction.tsx
import React, { useEffect } from 'react';
import { connectToSocket, disconnectSocket } from '../socket';

type AuctionProps = {
    auctionId: string;
};

const Auction: React.FC<AuctionProps> = ({ auctionId }) => {
    useEffect(() => {
        // Connect to the socket when the component mounts
        const socket = connectToSocket(auctionId);

        // Clean up the socket connection when the component unmounts
        return () => {
            disconnectSocket();
        };
    }, [auctionId]);

    return (
        <div>
            <h1>Auction: {auctionId}</h1>
            <p>Live updates will be displayed here...</p>
        </div>
    );
};

export default Auction;
