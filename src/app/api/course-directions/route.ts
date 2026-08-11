import { type NextRequest, NextResponse } from "next/server";

// ponytail: server-only route so the Naver Maps client secret never ships to the
// browser bundle, same reasoning as /api/reverse-geocode. Direction 15 is a driving
// route — Naver has no public walking-directions API, so this is a car route stand-in
// for what's really a walking course (see course-route-map.tsx).
export async function GET(request: NextRequest) {
  const startLat = request.nextUrl.searchParams.get("startLat");
  const startLng = request.nextUrl.searchParams.get("startLng");
  const goalLat = request.nextUrl.searchParams.get("goalLat");
  const goalLng = request.nextUrl.searchParams.get("goalLng");
  if (!startLat || !startLng || !goalLat || !goalLng) {
    return NextResponse.json({ error: "startLat, startLng, goalLat and goalLng are required" }, { status: 400 });
  }

  const clientId = process.env.NAVER_MAP_CLIENT_ID;
  const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Naver Map API credentials are not configured" }, { status: 500 });
  }

  const naverUrl = new URL("https://maps.apigw.ntruss.com/map-direction-15/v1/driving");
  naverUrl.searchParams.set("start", `${startLng},${startLat}`); // Naver expects "lng,lat"
  naverUrl.searchParams.set("goal", `${goalLng},${goalLat}`);

  const res = await fetch(naverUrl, {
    headers: {
      "x-ncp-apigw-api-key-id": clientId,
      "x-ncp-apigw-api-key": clientSecret,
    },
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Directions request failed" }, { status: 502 });
  }

  const data = await res.json();
  const route = data?.route?.traoptimal?.[0]?.path as [number, number][] | undefined;
  if (!route) {
    return NextResponse.json({ error: "No route found" }, { status: 404 });
  }

  // Naver returns [lng, lat]; flip to [lat, lng] to match this app's own coordinate shape.
  const path = route.map(([lng, lat]) => [lat, lng]);
  return NextResponse.json({ path });
}
