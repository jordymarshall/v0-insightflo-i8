import { NextResponse } from "next/server";

const backendUrl = process.env.BACKEND_URL;

// Simple in-memory store (resets when server restarts)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT = 5; // requests
const WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  // Reset window
  if (now - entry.lastReset > WINDOW_MS) {
    entry.count = 1;
    entry.lastReset = now;
    return false;
  }

  // Check limit
  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const backendRes = await fetch(`${backendUrl}/api/v1/interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to contact backend" },
      { status: 500 }
    );
  }
}

