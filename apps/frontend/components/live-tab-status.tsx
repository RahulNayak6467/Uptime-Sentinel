"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import { DashboardOverviewResponse } from "@/features/Overview/types";

const BASE_TITLE = "UptimeSentinel";
const OK_COLOR = "#22c55e";
const DOWN_COLOR = "#ef4444";

/**
 * Reflects live system status in the browser tab so a user can tell, from a
 * background tab, whether anything is down — the same title/favicon signal
 * used by dedicated uptime tools. Reads the shared dashboard-overview query
 * (kept fresh by SSE on the overview page and a background poll elsewhere),
 * so it stays in step with the on-page stats without its own data source.
 */
export default function LiveTabStatus() {
  const pathname = usePathname();

  const { data } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: () =>
      apiFetch<ApiDataResponse<DashboardOverviewResponse>>(
        "/dashboard/overview",
      ).then((res) => res.data),
    refetchInterval: 60_000,
  });

  const downCount = data?.down_count ?? 0;

  // Re-apply on downCount change and on navigation, because Next resets the
  // document title to page metadata on each route change.
  useEffect(() => {
    document.title =
      downCount > 0 ? `🔴 (${downCount}) down · ${BASE_TITLE}` : BASE_TITLE;
    applyFavicon(downCount);
  }, [downCount, pathname]);

  // Restore a clean tab when leaving the dashboard (e.g. logout), so a stale
  // "down" title/favicon doesn't linger on the login screen.
  useEffect(() => {
    return () => {
      document.title = BASE_TITLE;
      applyFavicon(0);
    };
  }, []);

  return null;
}

function applyFavicon(downCount: number) {
  const href = drawFavicon(downCount);
  if (!href) return;

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Draws a 32px status dot (green when all up, red with a count when down). */
function drawFavicon(downCount: number): string {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const allUp = downCount === 0;

  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.fillStyle = allUp ? OK_COLOR : DOWN_COLOR;
  ctx.fill();

  if (!allUp) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 19px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(downCount > 9 ? "9+" : String(downCount), size / 2, size / 2 + 1);
  }

  return canvas.toDataURL("image/png");
}
