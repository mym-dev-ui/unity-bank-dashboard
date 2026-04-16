import { useEffect, useRef } from "react";
import { shamApi } from "@/lib/shamApi";

function getOrCreateId(): string {
  let id = localStorage.getItem("sham_visitor_id");
  if (!id) {
    id = `v-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("sham_visitor_id", id);
    localStorage.setItem("sham_visitor_connected_at", new Date().toLocaleTimeString("ar-SY"));
  }
  return id;
}

export function useVisitorTracking(pageName: string) {
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const id = getOrCreateId();
    localStorage.setItem("sham_visitor_page", pageName);

    shamApi.patch(id, { page: pageName, isActive: true, lastSeen: Date.now() });

    heartbeatRef.current = setInterval(() => {
      shamApi.heartbeat(id, pageName, true);
    }, 3000);

    const onUnload = () => {
      shamApi.heartbeat(id, pageName, false);
    };
    window.addEventListener("beforeunload", onUnload);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [pageName]);
}
