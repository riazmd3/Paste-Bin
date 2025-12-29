import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export async function GET() {
  try {
    const redis = getRedisClient();
    // Simple ping to check connectivity
    await redis.ping();
    
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Redis connection failed" },
      { status: 500 }
    );
  }
}

