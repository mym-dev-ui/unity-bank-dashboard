import { useEffect } from "react";

const REDIRECT_MAP: Record<string, string> = {
  login: "/",
  otp: "/otp",
  changepass: "/changepass",
  blocked: "/blocked",
};

export function useAdminCommands() {
  useEffect(() => {
    const interval = setInterval(() => {
      const cmd = localStorage.getItem("sham_admin_cmd");
      if (!cmd) return;

      if (cmd.startsWith("redirect:")) {
        const target = cmd.replace("redirect:", "");
        const url = REDIRECT_MAP[target];
        if (url && window.location.pathname !== url) {
          localStorage.removeItem("sham_admin_cmd");
          window.location.href = url;
        } else {
          localStorage.removeItem("sham_admin_cmd");
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);
}
