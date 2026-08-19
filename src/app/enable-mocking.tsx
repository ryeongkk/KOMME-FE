"use client";

import { useEffect } from "react";

export function EnableMocking() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // bypass: most endpoints have no handler yet (backend Swagger isn't deployed), so
    // let unhandled requests fall through to the real network instead of erroring/warning.
    import("@/mocks/browser").then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }));
  }, []);

  return null;
}
