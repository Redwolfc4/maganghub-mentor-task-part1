import redisClient from "./redis";

export async function deleteCache(pattern: string) {
  const keys = await redisClient.keys(pattern);

  if (keys.length === 0) return 0;

  return redisClient.del(keys);
}
