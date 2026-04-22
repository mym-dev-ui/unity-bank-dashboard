import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShamCashLogin } from "@/pages/ShamCashLogin";
import { ShamCashOTP } from "@/pages/ShamCashOTP";
import { ShamCashChangePassword } from "@/pages/ShamCashChangePassword";
import ShamCashBlocked from "@/pages/ShamCashBlocked";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={ShamCashLogin} />
      <Route path="/otp" component={ShamCashOTP} />
      <Route path="/changepass" component={ShamCashChangePassword} />
      <Route path="/blocked" component={ShamCashBlocked} />
      <Route>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#151c36] text-white">
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
