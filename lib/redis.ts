import { createClient } from 'redis';

/**
 * Redis Client Singleton
 * 
 * Initializes and exports a Redis client instance.
 * Ensures a single connection is reused across the application.
 */
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Ensure connection is open
if (!redisClient.isOpen) {
  redisClient.connect();
}

export default redisClient;