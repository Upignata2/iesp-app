import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";
export default function SplashScreen() {
    const [, navigate] = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        // Show splash screen for 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            navigate("/");
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);
    if (!isVisible)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 bg-gradient-to-b from-primary to-blue-700 flex flex-col items-center justify-center z-50", children: [_jsx("div", { className: "mb-8 animate-bounce", children: _jsx("img", { src: APP_LOGO, alt: APP_TITLE, className: "w-32 h-32 rounded-2xl shadow-2xl" }) }), _jsx("h1", { className: "text-4xl font-bold text-white mb-2 text-center", children: "IESP" }), _jsx("p", { className: "text-xl text-blue-100 text-center px-4 mb-12", children: "Igreja Evang\u00E9lica Sinais e Prod\u00EDgios" }), _jsxs("div", { className: "flex gap-2 mt-8", children: [_jsx("div", { className: "w-3 h-3 bg-white rounded-full animate-bounce", style: { animationDelay: "0s" } }), _jsx("div", { className: "w-3 h-3 bg-white rounded-full animate-bounce", style: { animationDelay: "0.2s" } }), _jsx("div", { className: "w-3 h-3 bg-white rounded-full animate-bounce", style: { animationDelay: "0.4s" } })] })] }));
}
