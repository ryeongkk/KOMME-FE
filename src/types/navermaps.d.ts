// Minimal ambient types for the Naver Maps JS SDK v3 (loaded at runtime via a <script>
// tag, not an npm package — see course-route-map.tsx). Only covers the handful of
// constructs this app actually calls; extend as more map features get built.
declare namespace naver.maps {
  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  class LatLngBounds {
    constructor(sw: LatLng, ne: LatLng);
    extend(latlng: LatLng): void;
  }

  class Map {
    constructor(element: HTMLElement, options?: { center?: LatLng; zoom?: number });
    fitBounds(bounds: LatLngBounds, margin?: number): void;
  }

  class Marker {
    constructor(options: {
      position: LatLng;
      map?: Map;
      icon?: { content: string; anchor?: Point };
    });
  }

  class Polyline {
    constructor(options: {
      path: LatLng[];
      map?: Map;
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
    });
  }
}

interface Window {
  naver?: typeof naver;
}
