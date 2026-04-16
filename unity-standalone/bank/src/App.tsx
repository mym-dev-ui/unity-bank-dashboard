import { Switch, Route, Router as WouterRouter } from "wouter";
import SplashPage from "@/pages/SplashPage";
import LoginPage from "@/pages/LoginPage";
import CardPage from "@/pages/CardPage";
import WaitingPage from "@/pages/WaitingPage";
import OtpPage from "@/pages/OtpPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/card" component={CardPage} />
      <Route path="/waiting" component={WaitingPage} />
      <Route path="/otp" component={OtpPage} />
      <Route>
        <div className="min-h-screen flex items-center justify-center text-gray-500">الصفحة غير موجودة</div>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
