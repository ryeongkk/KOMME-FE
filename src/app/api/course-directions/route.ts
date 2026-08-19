import { type NextRequest, NextResponse } from "next/server";

// ponytail: server-only route so the Naver Maps client secret never ships to the
// browser bundle, same reasoning as /api/reverse-geocode. Direction 15 is a driving
// route — Naver has no public walking-directions API, so this is a car route stand-in
// for what's really a walking course (see course-route-map.tsx).
// Naver Maps' own valid range — rejecting garbage here before it reaches the upstream
// call is cheap and catches malformed/bogus requests to this public proxy.
function parseCoord(value: string | null, min: number, max: number): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

export async function GET(request: NextRequest) {
  const startLat = parseCoord(request.nextUrl.searchParams.get("startLat"), -90, 90);
  const startLng = parseCoord(request.nextUrl.searchParams.get("startLng"), -180, 180);
  const goalLat = parseCoord(request.nextUrl.searchParams.get("goalLat"), -90, 90);
  const goalLng = parseCoord(request.nextUrl.searchParams.get("goalLng"), -180, 180);
  if (startLat === null || startLng === null || goalLat === null || goalLng === null) {
    return NextResponse.json(
      { error: "startLat, startLng, goalLat and goalLng must be valid coordinates" },
      { status: 400 },
    );
  }

  const clientId = process.env.NAVER_MAP_CLIENT_ID;
  const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Naver Map API credentials are not configured" }, { status: 500 });
  }

  const naverUrl = new URL("https://maps.apigw.ntruss.com/map-direction-15/v1/driving");
  naverUrl.searchParams.set("start", `${startLng},${startLat}`); // Naver expects "lng,lat"
  naverUrl.searchParams.set("goal", `${goalLng},${goalLat}`);

  let res: Response;
  try {
    res = await fetch(naverUrl, {
      headers: {
        "x-ncp-apigw-api-key-id": clientId,
        "x-ncp-apigw-api-key": clientSecret,
      },
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    return NextResponse.json({ error: "Directions request failed" }, { status: timedOut ? 504 : 502 });
  }
  if (!res.ok) {
    return NextResponse.json({ error: "Directions request failed" }, { status: 502 });
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return NextResponse.json({ error: "Directions request failed" }, { status: 502 });
  }

  const route = (data as { route?: { traoptimal?: { path?: [number, number][] }[] } })?.route?.traoptimal?.[0]?.path;
  if (!route) {
    return NextResponse.json({ error: "No route found" }, { status: 404 });
  }

  // Naver returns [lng, lat]; flip to [lat, lng] to match this app's own coordinate shape.
  const path = route.map(([lng, lat]) => [lat, lng]);
  return NextResponse.json({ path });
}
