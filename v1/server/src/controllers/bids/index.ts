const placeBid = async (req, res) => {
    const { auctionId } = req.params;
    const { amount } = req.body;

    try {
        const auctionRef = db.collection('auctions').doc(auctionId);
        const auctionSnapshot = await auctionRef.get();

        if (!auctionSnapshot.exists) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        const auction = auctionSnapshot.data();

        if (amount <= auction.highestBid) {
            return res.status(400).json({ message: 'Bid must be higher than current highest bid' });
        }

        // Place the bid
        const bidRef = await db.collection('bids').add({
            auctionId,
            userId: req.user.uid,
            amount,
            bidTime: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update the highest bid in the auction
        await auctionRef.update({
            highestBid: amount,
            highestBidder: req.user.uid,
        });

        res.status(201).json({ bidId: bidRef.id });
    } catch (error) {
        res.status(400).json({ message: 'Error placing bid', error });
    }
};

module.exports = { placeBid };
