import React from 'react';
import { connectToSocket } from '../../../../socket';

export default function BidForm() {
    const socket = connectToSocket('Sale of A dog');

    interface IBidData {
        userId: string;
        amount: number;
        auctionId: string;
    }

    const handleSubmitBid = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const bidAmount = (e.target as HTMLFormElement).bidAmount.value;

        const bidData: IBidData = {
            amount: parseFloat(bidAmount),
            userId: 'WoqtkliuV2OkgXiGsiQOTHhbQzs1',
            auctionId: 'Sale of A dog',
        };

        socket.emit('placeBid', bidData);
    };

    return (
        <form onSubmit={handleSubmitBid}>
            <input type="number" name="bidAmount" placeholder="Enter your bid" required />
            <button type="submit">Place Bid</button>
        </form>
    );
}
