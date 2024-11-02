const dotenv = require('dotenv');
const Redis = require('ioredis');

dotenv.config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('connect', () => {
    console.log('Connected to Redis Cloud');
});

redisClient.on('error', (error) => {
    console.error('Redis Client Error:', error);
});

// Test the connection
redisClient
    .ping()
    .then((result) => {
        console.log('Ping response:', result);
    })
    .catch((error) => {
        console.error('Error pinging Redis:', error);
    });

module.exports = redisClient;
