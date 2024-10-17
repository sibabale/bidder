import { io, Socket } from 'socket.io-client';

// Replace with the actual URL of your server
const SERVER_URL = 'http://localhost:3333';

let socket: Socket | null = null;

export const connectToSocket = (auctionId: string): Socket => {
    if (!socket) {
        socket = io(SERVER_URL, {
            query: { auctionId },
        });

        // Log connection events
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('placeBid', (newBid) => {
            console.log('New bid received:', newBid);
            // Update the UI to reflect the new bid
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Handle auction updates
        socket.on('auctionUpdated', (data) => {
            console.log('Auction updated:', data);
        });
    }

    return socket;
};

export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
