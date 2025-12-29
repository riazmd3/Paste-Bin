import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { setPaste, type PasteData } from "@/lib/redis";
import { getCurrentTimeMs } from "@/lib/time";

interface CreatePasteRequest {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

function validateCreateRequest(body: any): {
  valid: boolean;
  error?: string;
  data?: CreatePasteRequest;
} {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const { content, ttl_seconds, max_views } = body;

  // Validate content
  if (typeof content !== "string" || content.trim().length === 0) {
    return { valid: false, error: "content is required and must be a non-empty string" };
  }

  // Validate ttl_seconds
  if (ttl_seconds !== undefined) {
    if (typeof ttl_seconds !== "number" || !Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
      return { valid: false, error: "ttl_seconds must be an integer >= 1" };
    }
  }

  // Validate max_views
  if (max_views !== undefined) {
    if (typeof max_views !== "number" || !Number.isInteger(max_views) || max_views < 1) {
      return { valid: false, error: "max_views must be an integer >= 1" };
    }
  }

  return {
    valid: true,
    data: {
      content: content.trim(),
      ttl_seconds,
      max_views,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateCreateRequest(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { content, ttl_seconds, max_views } = validation.data!;
    const now = getCurrentTimeMs(request);
    const id = nanoid();

    const pasteData: PasteData = {
      content,
      created_at: now,
      expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
      max_views: max_views ?? null,
      views: 0,
    };

    await setPaste(id, pasteData);

    // Get the host from the request
    const host = request.headers.get("host") || "localhost:3000";
    // Check for forwarded protocol (Vercel/proxy) or use https in production
    const protocol =
      request.headers.get("x-forwarded-proto") ||
      (process.env.NODE_ENV === "production" ? "https" : "http");
    const url = `${protocol}://${host}/p/${id}`;

    return NextResponse.json(
      {
        id,
        url,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating paste:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }
    // Check if it's a Redis connection error
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    if (errorMessage.includes("UPSTASH_REDIS") || errorMessage.includes("Redis")) {
      return NextResponse.json(
        { error: "Database connection error. Please check your Redis credentials." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

