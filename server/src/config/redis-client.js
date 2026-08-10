const dotenv = require('dotenv');
const { createClient } = require('redis');

dotenv.config();

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
    },
});

redisClient.on('connect', () => {
    console.log('Connected to Redis Cloud');
});

redisClient.on('error', (error) => {
    console.error('Redis Client Error:', error);
});

redisClient.connect().catch((error) => {
    console.error('Failed to connect to Redis:', error);
});

module.exports = redisClient;
