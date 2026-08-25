export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded bg-gray-100 ${className ?? ""}`} />;
}
