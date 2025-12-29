import { Redis } from "@upstash/redis";

export interface PasteData {
  content: string;
  created_at: number;
  expires_at: number | null;
  max_views: number | null;
  views: number;
}

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set"
      );
    }

    redisClient = new Redis({
      url,
      token,
    });
  }

  return redisClient;
}

export async function getPaste(id: string): Promise<PasteData | null> {
  const redis = getRedisClient();
  const data = await redis.get<PasteData>(`paste:${id}`);
  return data;
}

export async function setPaste(id: string, data: PasteData): Promise<void> {
  const redis = getRedisClient();
  await redis.set(`paste:${id}`, data);
}

/**
 * Atomically increment views and return the updated paste data
 * Returns null if paste doesn't exist
 * Note: View limit checking is done in the API route after increment
 * to ensure we don't serve pastes that exceed limits
 */
export async function incrementViews(id: string): Promise<PasteData | null> {
  const redis = getRedisClient();
  const key = `paste:${id}`;
  
  // Use a Lua script for atomic increment
  // Upstash REST API supports eval with Lua scripts
  const script = `
    local data = redis.call('GET', KEYS[1])
    if not data then
      return nil
    end
    local paste = cjson.decode(data)
    -- Increment views atomically
    paste.views = paste.views + 1
    local encoded = cjson.encode(paste)
    redis.call('SET', KEYS[1], encoded)
    return encoded
  `;
  
  try {
    const result = await redis.eval(script, [key], []);
    
    if (result === null || typeof result !== 'string') {
      return null;
    }
    
    return JSON.parse(result) as PasteData;
  } catch (error) {
    // Fallback: fetch, modify, set
    // This is not fully atomic but works as a fallback
    const paste = await getPaste(id);
    if (!paste) {
      return null;
    }
    paste.views += 1;
    await setPaste(id, paste);
    return paste;
  }
}

