import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Newspaper, Calendar, Music, Heart, Users, MessageSquare, Gift, Video, Globe, Instagram } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
export default function Home() {
    const { user, loading, isAuthenticated, logout: rawLogout } = useAuth();
    const [, navigate] = useLocation();
    const [showMenu, setShowMenu] = useState(false);
    const logout = async () => { await rawLogout(); navigate("/login", { replace: true }); };
    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);
    const menuItems = [
        { id: 1, label: "Artigos", icon: BookOpen, color: "bg-blue-500", route: "/articles" },
        { id: 2, label: "Notícias", icon: Newspaper, color: "bg-blue-600", route: "/news" },
        { id: 3, label: "Eventos", icon: Calendar, color: "bg-blue-700", route: "/events" },
        { id: 4, label: "Hinário", icon: Music, color: "bg-indigo-500", route: "/hymns" },
        { id: 5, label: "Palavra do Dia", icon: Heart, color: "bg-indigo-600", route: "/daily-word" },
        { id: 6, label: "Motivo de Oração", icon: Users, color: "bg-indigo-700", route: "/prayer-reasons" },
        { id: 7, label: "Horário dos Cultos", icon: Calendar, color: "bg-purple-500", route: "/service-schedules" },
        { id: 8, label: "Fale Conosco", icon: MessageSquare, color: "bg-purple-600", route: "/contact" },
        { id: 9, label: "Campanhas", icon: Gift, color: "bg-purple-700", route: "/campaigns" },
        { id: 10, label: "Galeria", icon: Video, color: "bg-pink-500", route: "/gallery" },
        { id: 11, label: "Site", icon: Globe, color: "bg-slate-600", route: "external:https://instagram.com/" },
        { id: 12, label: "Instagram", icon: Instagram, color: "bg-slate-700", route: "external:https://instagram.com/" },
    ];
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "animate-spin w-12 h-12 text-primary mx-auto mb-4" }), _jsx("p", { className: "text-foreground", children: "Carregando..." })] }) }));
    }
    const handleClick = (route) => {
        if (route.startsWith("external:")) {
            const url = route.replace("external:", "");
            window.open(url, "_blank");
        }
        else {
            navigate(route);
        }
    };
    return (_jsxs("div", { className: "min-h-screen pb-24 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 relative", children: [isAuthenticated && _jsx(Button, { className: "absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white ring-1 ring-white/20", onClick: logout, children: "Sair" }), _jsxs("div", { className: "mx-4 mt-8 text-center text-white", children: [_jsx("img", { src: APP_LOGO, alt: APP_TITLE, className: "w-20 h-20 mx-auto rounded-xl mb-2 shadow-lg", onError: (e) => { e.currentTarget.src = APP_LOGO_FALLBACK; } }), _jsx("div", { className: "text-sm opacity-80", children: "IESP" })] }), _jsx("div", { className: "backdrop-blur-md", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-6", children: [!isAuthenticated ? (_jsxs("div", { className: "text-center mb-6", children: [_jsx(Button, { size: "lg", className: "bg-white text-blue-700", onClick: () => navigate('/login'), children: "Login" }), _jsx("div", { className: "mt-3", children: _jsx(Button, { variant: "ghost", onClick: () => navigate('/'), children: "Continuar sem login" }) })] })) : (_jsxs("div", { className: "hidden", children: [] })), _jsx("div", { className: "grid grid-cols-3 gap-4", children: menuItems.map((item) => {
                                const Icon = item.icon;
                                return (_jsxs("button", { onClick: () => handleClick(item.route), className: "group flex flex-col items-center gap-3 transition-transform hover:scale-105", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-white shadow-lg", children: _jsx(Icon, { className: "w-7 h-7" }) }), _jsx("span", { className: "text-xs text-white/80", children: item.label })] }, item.id));
                            }) })] }) })] }));
}
