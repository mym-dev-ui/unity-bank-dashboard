import { useEffect, useRef } from "react";
import { api } from "./api";

export function useHeartbeat(page: string) {
  const pageRef = useRef(page);
  pageRef.current = page;
  useEffect(() => {
    const id = localStorage.getItem("wiqaya_id");
    if (!id) return;
    const ping = () => api.patch(id, { page: pageRef.current, isActive: true, lastSeen: Date.now() });
    ping();
    const iv = setInterval(ping, 3000);
    return () => clearInterval(iv);
  }, []);
}

export function useCommandPoll(handlers: Record<string, () => void>) {
  useEffect(() => {
    const id = localStorage.getItem("wiqaya_id");
    if (!id) return;
    const iv = setInterval(async () => {
      const cmd = await api.getCmd(id);
      if (cmd && handlers[cmd]) handlers[cmd]();
    }, 2000);
    return () => clearInterval(iv);
  }, []);
}
