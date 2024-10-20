import React from 'react';
import Auction from './components/Auction';
import './App.css';
import BidForm from './components/molecules/forms/bid-form';

const App: React.FC = () => {
    const auctionId = 'Sale of A dog';

    return (
        <div className="App">
            <h1>Welcome to the Bidding System</h1>
            <Auction auctionId={auctionId} />
            <BidForm />
        </div>
    );
};

export default App;
