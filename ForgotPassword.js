import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
export default function ForgotPassword() {
    const [, navigate] = useLocation();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            // TODO: Implementar envio de e-mail de recuperação de senha
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }
        catch (err) {
            setError("Erro ao enviar e-mail. Tente novamente.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-primary to-blue-700 flex items-center justify-center p-4", children: _jsxs(Card, { className: "w-full max-w-md p-8", children: [_jsx("div", { className: "mb-6", children: _jsxs(Button, { variant: "ghost", onClick: () => navigate("/login"), className: "mb-4", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Voltar"] }) }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Recuperar Senha" }), _jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Digite seu e-mail para receber instru\u00E7\u00F5es" })] }), success && (_jsx("div", { className: "p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm mb-6", children: "E-mail enviado com sucesso! Verifique sua caixa de entrada." })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "E-mail" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "seu@email.com", required: true })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm", children: error })), _jsxs(Button, { type: "submit", disabled: isLoading, className: "w-full bg-primary hover:bg-blue-700 text-white", children: [isLoading && _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Enviar Instru\u00E7\u00F5es"] })] })] }) }));
}
