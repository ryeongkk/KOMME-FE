import { type NextRequest, NextResponse } from "next/server";
import { translateDistrict } from "@/components/course/create-data";

// ponytail: server-only route so the Naver Maps client secret never ships to the
// browser bundle. Client calls this, this calls Naver.
export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lng = request.nextUrl.searchParams.get("lng");
  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const clientId = process.env.NAVER_MAP_CLIENT_ID;
  const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Naver Map API credentials are not configured" }, { status: 500 });
  }

  const naverUrl = new URL("https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc");
  naverUrl.searchParams.set("coords", `${lng},${lat}`); // Naver expects "lng,lat"
  naverUrl.searchParams.set("orders", "legalcode");
  naverUrl.searchParams.set("output", "json");

  const res = await fetch(naverUrl, {
    headers: {
      "x-ncp-apigw-api-key-id": clientId,
      "x-ncp-apigw-api-key": clientSecret,
    },
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Reverse geocoding request failed" }, { status: 502 });
  }

  const data = await res.json();
  const region = data?.results?.[0]?.region;
  const cityKo: string | undefined = region?.area1?.name;
  const guKo: string | undefined = region?.area2?.name;
  if (!cityKo || !guKo) {
    return NextResponse.json({ error: "No matching address found" }, { status: 404 });
  }

  // Seoul/Busan get the translated "Gu, City" label; anywhere else falls back to the
  // raw (Korean) address instead of erroring — this screen just says Seoul/Busan are
  // the only supported search targets, it doesn't need to block detecting a location.
  const location = translateDistrict(cityKo, guKo) ?? `${cityKo} ${guKo}`;

  return NextResponse.json({ location });
}
