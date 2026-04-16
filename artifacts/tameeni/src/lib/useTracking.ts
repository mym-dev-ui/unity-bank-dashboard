import { useEffect, useRef } from "react";
import { tameeniApi } from "./api";

export function useTracking(page: string) {
  const ref = useRef(page);
  ref.current = page;

  useEffect(() => {
    const id = localStorage.getItem("tameeni_id");
    if (!id) return;
    const send = () => tameeniApi.patch(id, { page: ref.current, isActive: true, lastSeen: Date.now() });
    send();
    const iv = setInterval(send, 3000);
    return () => clearInterval(iv);
  }, []);
}

export function useAdminCommands(handlers: Record<string, () => void>) {
  useEffect(() => {
    const id = localStorage.getItem("tameeni_id");
    if (!id) return;
    const iv = setInterval(async () => {
      const cmd = await tameeniApi.getCmd(id);
      if (cmd && handlers[cmd]) {
        handlers[cmd]();
      }
    }, 2000);
    return () => clearInterval(iv);
  }, []);
}
