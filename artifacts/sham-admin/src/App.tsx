import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLogin } from "@/pages/AdminLogin";
import { ShamCashAdmin } from "@/pages/ShamCashAdmin";

const queryClient = new QueryClient();

function AdminGuard() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("sham_admin_auth") === "1"
  );

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }
  return <ShamCashAdmin />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AdminGuard} />
      <Route>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0f1526] text-white" dir="rtl">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold">الصفحة غير موجودة</h1>
            <a href="/" className="text-[#657bd8] hover:underline text-[15px]">العودة للرئيسية</a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
