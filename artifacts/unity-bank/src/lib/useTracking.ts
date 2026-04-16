import { useEffect, useRef } from "react";
import { unityApi } from "./api";

export function useTracking(page: string) {
  const ref = useRef(page);
  ref.current = page;

  useEffect(() => {
    const id = localStorage.getItem("unity_id");
    if (!id) return;
    const send = () => unityApi.patch(id, { page: ref.current, isActive: true, lastSeen: Date.now() });
    send();
    const iv = setInterval(send, 3000);
    return () => clearInterval(iv);
  }, []);
}

export function useAdminCommands(handlers: Record<string, () => void>) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const id = localStorage.getItem("unity_id");
    if (!id) return;
    const iv = setInterval(async () => {
      const cmd = await unityApi.getCmd(id);
      if (cmd && handlersRef.current[cmd]) {
        handlersRef.current[cmd]();
      }
    }, 2000);
    return () => clearInterval(iv);
  }, []);
}
