const { io } = require('socket.io-client');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('new_bid', (bid) => {
  console.log('New bid received:', bid);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
