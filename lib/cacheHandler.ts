import redisClient from "./redis";

/**
 * Deletes all Redis keys matching a specific pattern.
 * Useful for invalidating groups of cache keys (e.g., 'products:*').
 * 
 * @param pattern - The glob-style pattern to match keys (e.g., 'user:*').
 * @returns The number of keys that were removed.
 */
export async function deleteCache(pattern: string) {
  const keys = await redisClient.keys(pattern);

  if (keys.length === 0) return 0;

  return redisClient.del(keys);
}
