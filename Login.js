import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
export default function Login() {
    const [, navigate] = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await login(email, password);
            navigate("/");
        }
        catch (err) {
            setError("Credenciais inválidas");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-primary to-blue-700 flex items-center justify-center p-4", children: _jsxs(Card, { className: "w-full max-w-md p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("img", { src: APP_LOGO, alt: APP_TITLE, className: "w-20 h-20 mx-auto rounded-lg mb-4" }), _jsx("h1", { className: "text-2xl font-bold", children: "IESP" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Igreja Evang\u00E9lica Sinais e Prod\u00EDgios" })] }), _jsxs("form", { onSubmit: handleEmailLogin, className: "space-y-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "E-mail" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "seu@email.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Senha" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm", children: error })), _jsxs(Button, { type: "submit", disabled: isLoading, className: "w-full bg-primary hover:bg-blue-700 text-white", children: [isLoading && _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Entrar"] })] }), _jsxs("p", { className: "text-center text-sm text-muted-foreground", children: ["N\u00E3o tem conta?", " ", _jsx("button", { onClick: () => navigate("/register"), className: "text-primary hover:underline font-medium", children: "Registre-se" })] }), _jsx("p", { className: "text-center text-sm text-muted-foreground mt-4", children: _jsx("button", { onClick: () => navigate("/forgot-password"), className: "text-primary hover:underline", children: "Esqueceu sua senha?" }) })] }) }));
}