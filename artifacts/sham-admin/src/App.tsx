import { useState, useEffect } from "react";
import AdminLogin from "./pages/AdminLogin";
import ShamCashAdmin from "./pages/ShamCashAdmin";
import "./index.css";

export default function App() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("sham_admin_auth") === "1") {
      setAuthed(true);
    }
  }, []);

  const handleLogin = () => {
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sham_admin_auth");
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <ShamCashAdmin onLogout={handleLogout} />;
}
