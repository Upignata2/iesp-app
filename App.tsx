import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MobileLayout from "./MobileLayout";
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Articles from "./pages/Articles";
import News from "./pages/News";
import Events from "./pages/Events";
import Hymns from "./pages/Hymns";
import DailyWord from "./pages/DailyWord";
import PrayerReasons from "./pages/PrayerReasons";
import ServiceSchedules from "./pages/ServiceSchedules";
import Contact from "./pages/Contact";
import Campaigns from "./pages/Campaigns";
import Gallery from "./pages/Gallery";
import Videos from "./pages/Videos";
import Favorites from "./pages/Favorites";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route>
        {() => (
            <MobileLayout>
              <Switch>
                <Route path={"/home"} component={Home} />
                <Route path={"/profile"} component={Profile} />
                <Route path={"/admin"} component={Admin} />
                <Route path={"/articles"} component={Articles} />
                <Route path={"/news"} component={News} />
                <Route path={"/events"} component={Events} />
                <Route path={"/hymns"} component={Hymns} />
                <Route path={"/daily-word"} component={DailyWord} />
                <Route path={"/prayer-reasons"} component={PrayerReasons} />
                <Route path={"/service-schedules"} component={ServiceSchedules} />
                <Route path={"/contact"} component={Contact} />
                <Route path={"/campaigns"} component={Campaigns} />
                <Route path={"/gallery"} component={Gallery} />
                <Route path={"/videos"} component={Videos} />
                <Route path={"/favorites"} component={Favorites} />
                <Route path={"/menu"} component={Menu} />
                <Route path={"/404"} component={NotFound} />
                {/* Final fallback route */}
                <Route component={NotFound} />

              </Switch>
            </MobileLayout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path={"/"} component={RootEntry} />
            <Route>
              {() => <Router />}
            </Route>
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

function RootEntry() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true } as any);
    }
  }, [isAuthenticated, navigate]);
  return <Login />;
}
