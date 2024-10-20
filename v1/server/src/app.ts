import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import { doc, getDoc, updateDoc, Timestamp, onSnapshot, arrayUnion } from 'firebase/firestore';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server as SocketServer } from 'socket.io';

import api from './api';
import { db } from './config/firebase';
import * as middlewares from './middlewares';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Bidding API 🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.use((req, res, next) => {
    console.log('Received request:', req.url);
    next();
});

const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('Client connected');

    // Existing auctionId handling
    const auctionId = socket.handshake.query.auctionId as string;

    if (auctionId) {
        const auctionRef = doc(db, 'auctions', auctionId);

        onSnapshot(auctionRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                socket.emit('auctionUpdated', docSnapshot.data());
            } else {
                console.log('Auction not found');
            }
        });
    }

    socket.on('placeBid', async (bidData) => {
        try {
            const { userId, auctionId, amount } = bidData;

            const userRef = doc(db, 'user', userId);
            const auctionRef = doc(db, 'auctions', auctionId);

            const auctionDoc = await getDoc(auctionRef);

            if (auctionDoc.exists() && auctionDoc.data()) {
                const currentBid = auctionDoc.data().currentBid;

                if (typeof currentBid === 'number' && amount > currentBid) {
                    await updateDoc(auctionRef, {
                        currentBid: amount,
                        bids: arrayUnion({
                            userId,
                            amount,
                            timestamp: Timestamp,
                        }),
                    });

                    await updateDoc(userRef, {
                        bids: arrayUnion({ auctionId, amount, timestamp: Timestamp }),
                    });

                    io.emit('auctionUpdated', {
                        auctionId: auctionId,
                        currentBid: amount,
                    });
                } else {
                    socket.emit('bidError', {
                        message: 'Bid must be higher than the current bid.',
                    });
                }
            } else {
                socket.emit('bidError', { message: 'Auction not found.' });
            }
        } catch (error) {
            console.error('Error placing bid:', error);
            // You might want to emit an error event back to the client if necessary
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

io.listen(4000);
export { io, server };
export default app;
