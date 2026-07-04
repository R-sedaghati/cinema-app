import redisClient from "../config/redis.js";

export const rateLimitValidation = async (
  key: string,
  limit: number,
  ttlSeconds = 300,
): Promise<boolean> => {
  const cachedValue = await redisClient.get(key);

  if (!cachedValue) {
    await redisClient.set(
      key,
      JSON.stringify({ attempts: 1 }),
      { EX: ttlSeconds },
    );
    return true;
  }

  const data = JSON.parse(cachedValue);

  if (data.attempts >= limit) {
    return false;
  }

  data.attempts += 1;

  await redisClient.set(
    key,
    JSON.stringify(data),
    { EX: ttlSeconds },
  );

  return true;
};