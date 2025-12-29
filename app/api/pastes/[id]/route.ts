import { NextRequest, NextResponse } from "next/server";
import { getPaste, incrementViews } from "@/lib/redis";
import { getCurrentTimeMs } from "@/lib/time";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const now = getCurrentTimeMs(request);

    // Get paste data
    const paste = await getPaste(id);

    if (!paste) {
      return NextResponse.json(
        { error: "Paste not found" },
        { status: 404 }
      );
    }

    // Check expiration (TTL)
    if (paste.expires_at !== null && now >= paste.expires_at) {
      return NextResponse.json(
        { error: "Paste expired" },
        { status: 404 }
      );
    }

    // Check view limit
    if (paste.max_views !== null && paste.views >= paste.max_views) {
      return NextResponse.json(
        { error: "Paste view limit exceeded" },
        { status: 404 }
      );
    }

    // Atomically increment views
    const updatedPaste = await incrementViews(id);

    if (updatedPaste === null) {
      // Paste was deleted between check and increment
      return NextResponse.json(
        { error: "Paste not found" },
        { status: 404 }
      );
    }

    // Re-check expiration and view limit after increment
    if (updatedPaste.expires_at !== null && now >= updatedPaste.expires_at) {
      return NextResponse.json(
        { error: "Paste expired" },
        { status: 404 }
      );
    }

    if (updatedPaste.max_views !== null && updatedPaste.views >= updatedPaste.max_views) {
      return NextResponse.json(
        { error: "Paste view limit exceeded" },
        { status: 404 }
      );
    }

    // Calculate remaining views
    const remaining_views =
      updatedPaste.max_views !== null
        ? Math.max(0, updatedPaste.max_views - updatedPaste.views)
        : null;

    // Format expires_at
    const expires_at =
      updatedPaste.expires_at !== null
        ? new Date(updatedPaste.expires_at).toISOString()
        : null;

    return NextResponse.json(
      {
        content: updatedPaste.content,
        remaining_views,
        expires_at,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

