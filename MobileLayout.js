import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "wouter";
import { Home, Video, Star, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
export default function MobileLayout({ children }) {
    const [location, navigate] = useLocation();
    const navItems = [
        { label: "Home", icon: Home, path: "/home" },
        { label: "Vídeos", icon: Video, path: "/videos" },
        { label: "Favoritos", icon: Star, path: "/favorites" },
        { label: "Menu", icon: Menu, path: "/menu" },
    ];
    const isActive = (path) => {
        if (path === "/home" && location === "/home")
            return true;
        if (path !== "/home" && location.startsWith(path))
            return true;
        return false;
    };
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-background", children: [_jsx("main", { className: "flex-1 overflow-y-auto pb-20", children: children }), _jsx("nav", { className: "fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg", children: _jsx("div", { className: "flex justify-around items-center h-20 max-w-6xl mx-auto w-full", children: navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (_jsxs("button", { onClick: () => navigate(item.path), className: cn("flex flex-col items-center justify-center w-full h-full gap-1 transition-colors", active
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"), children: [_jsx(Icon, { className: "w-6 h-6" }), _jsx("span", { className: "text-xs font-medium", children: item.label })] }, item.path));
                    }) }) })] }));
}
