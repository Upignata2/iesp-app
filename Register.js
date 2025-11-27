import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
export default function Register() {
    const [, navigate] = useLocation();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }
        if (formData.password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }
        setIsLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        }
        catch (err) {
            setError("Erro ao registrar. Verifique os dados.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-primary to-blue-700 flex items-center justify-center p-4", children: _jsxs(Card, { className: "w-full max-w-md p-8", children: [_jsx("div", { className: "mb-6", children: _jsxs(Button, { variant: "ghost", onClick: () => navigate("/login"), className: "mb-4", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Voltar"] }) }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("img", { src: APP_LOGO, alt: APP_TITLE, className: "w-20 h-20 mx-auto rounded-lg mb-4" }), _jsx("h1", { className: "text-2xl font-bold", children: "Criar Conta" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "IESP" })] }), success && (_jsx("div", { className: "p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm mb-6", children: "Conta criada com sucesso! Redirecionando..." })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Nome Completo" }), _jsx(Input, { type: "text", name: "name", value: formData.name, onChange: handleChange, placeholder: "Seu Nome", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "E-mail" }), _jsx(Input, { type: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "seu@email.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Senha" }), _jsx(Input, { type: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Confirmar Senha" }), _jsx(Input, { type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm", children: error })), _jsxs(Button, { type: "submit", disabled: isLoading, className: "w-full bg-primary hover:bg-blue-700 text-white", children: [isLoading && _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Criar Conta"] })] }), _jsxs("p", { className: "text-center text-sm text-muted-foreground mt-6", children: ["J\u00E1 tem conta?", " ", _jsx("button", { onClick: () => navigate("/login"), className: "text-primary hover:underline font-medium", children: "Fa\u00E7a login" })] })] }) }));
}
