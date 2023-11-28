"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useRouterReferer() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const referer = new URLSearchParams(
    pathname + query.size ? `?${query.toString()}` : "",
  );

  const backToReferer = useCallback(() => {
    const nextUrl =
      new URLSearchParams(query.get("referer") || "").toString() || "/";
    router.push(nextUrl);
  }, [query, router]);

  return { referer, backToReferer };
}
