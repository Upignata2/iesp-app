import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SplashScreen from "./pages/SplashScreen";
import MobileLayout from "./MobileLayout";
import { useEffect, useState } from "react";
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
function Router() {
    return (_jsxs(Switch, { children: [_jsx(Route, { path: "/login", component: Login }), _jsx(Route, { path: "/register", component: Register }), _jsx(Route, { path: "/forgot-password", component: ForgotPassword }), _jsx(Route, { children: () => (_jsx(MobileLayout, { children: _jsxs(Switch, { children: [_jsx(Route, { path: "/", component: Home }), _jsx(Route, { path: "/profile", component: Profile }), _jsx(Route, { path: "/articles", component: Articles }), _jsx(Route, { path: "/news", component: News }), _jsx(Route, { path: "/events", component: Events }), _jsx(Route, { path: "/hymns", component: Hymns }), _jsx(Route, { path: "/daily-word", component: DailyWord }), _jsx(Route, { path: "/prayer-reasons", component: PrayerReasons }), _jsx(Route, { path: "/service-schedules", component: ServiceSchedules }), _jsx(Route, { path: "/contact", component: Contact }), _jsx(Route, { path: "/campaigns", component: Campaigns }), _jsx(Route, { path: "/gallery", component: Gallery }), _jsx(Route, { path: "/videos", component: Videos }), _jsx(Route, { path: "/favorites", component: Favorites }), _jsx(Route, { path: "/menu", component: Menu }), _jsx(Route, { path: "/404", component: NotFound }), _jsx(Route, { component: NotFound })] }) })) })] }));
}
function App() {
    const [showSplash, setShowSplash] = useState(true);
    useEffect(() => {
        // Hide splash after 3 seconds
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    return (_jsx(ErrorBoundary, { children: _jsx(ThemeProvider, { defaultTheme: "light", children: _jsxs(TooltipProvider, { children: [_jsx(Toaster, {}), showSplash && _jsx(SplashScreen, {}), _jsx(Router, {})] }) }) }));
}
export default App;
