import { db } from '../../config/firebase';
import { Request, Response } from 'express';
import {
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
    Timestamp,
    arrayUnion,
} from 'firebase/firestore';

interface IBid {
    userId: string;
    amount: number;
    timestamp: string;
}

interface IAuction {
    item: string;
    bids: IBid[];
    title: string;
    image: string;
    userId: string;
    status: 'Live' | 'Closed' | 'Cancelled' | 'Coming Soon';
    endDate: string;
    endTime: string;
    startDate: string;
    startTime: string;
    auctioneer: string;
    startPrice: number;
    description: string;
    incrementPrice: number;
}

export const createAuction = async (req: Request<{}, {}, IAuction>, res: Response) => {
    const {
        image,
        title,
        userId,
        endTime,
        endDate,
        startDate,
        startTime,
        startPrice,
        description,
        incrementPrice,
    } = req.body;

    try {
        const auctionRef = await addDoc(collection(db, 'auctions'), {
            bids: [],
            image,
            title,
            status: 'Live',
            endTime,
            endDate,
            startTime,
            startDate,
            currentBid: 0,
            startPrice,
            auctioneer: userId,
            description,
            incrementPrice,
        });

        const userRef = doc(db, 'users', userId);
        const auctionId = auctionRef.id;

        await updateDoc(userRef, {
            auctions: arrayUnion(auctionId),
        });

        res.status(201).json({ message: 'New auction has been created: ' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating auction', error });
    }
};

export const getAllAuctions = async (req: Request, res: Response) => {
    try {
        const auctionsRef = collection(db, 'auctions');
        const snapshot = await getDocs(auctionsRef);

        const auctions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(auctions);
    } catch (error) {
        console.error('Error fetching auctions: ', error);
        res.status(500).json({ message: 'Error fetching auctions', error });
    }
};

export const getAuctionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const auctionRef = doc(db, 'auctions', id);
        const auctionSnapshot = await getDoc(auctionRef);

        if (!auctionSnapshot.exists()) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        const auctionData = { id: auctionSnapshot.id, ...auctionSnapshot.data() };
        res.status(200).json(auctionData);
    } catch (error) {
        console.error('Error fetching auction:', error);
        res.status(500).json({ message: 'Error fetching auction', error });
    }
};
