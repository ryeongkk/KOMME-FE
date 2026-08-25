"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Created once per mount via useState, not module scope — a module-level client would
  // leak/share cache across requests during SSR.
  // staleTime > 0 so navigating back to an already-fetched screen (e.g. My tab) reuses the
  // cached response instead of refetching + blanking the UI on every mount.
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
