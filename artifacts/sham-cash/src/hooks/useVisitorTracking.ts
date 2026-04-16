import { useEffect, useRef } from "react";

export function useVisitorTracking(pageName: string) {
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("sham_visitor_id");
    if (!id) {
      id = `v-${Date.now()}`;
      localStorage.setItem("sham_visitor_id", id);
      localStorage.setItem("sham_visitor_connected_at", new Date().toLocaleTimeString("ar-SY"));
    }

    localStorage.setItem("sham_visitor_page", pageName);
    const currentStatus = localStorage.getItem("sham_visitor_status");
    if (!currentStatus || currentStatus === "disconnected") {
      localStorage.setItem("sham_visitor_status", "connected");
    }
    localStorage.setItem("sham_visitor_heartbeat", Date.now().toString());

    heartbeatRef.current = setInterval(() => {
      localStorage.setItem("sham_visitor_heartbeat", Date.now().toString());
    }, 1000);

    const onUnload = () => {
      localStorage.setItem("sham_visitor_status", "disconnected");
    };
    window.addEventListener("beforeunload", onUnload);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [pageName]);
}
