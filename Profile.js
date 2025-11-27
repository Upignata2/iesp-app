import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
export default function Profile() {
    const { user, loading, logout } = useAuth();
    const [, navigate] = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Loader2, { className: "animate-spin w-8 h-8 text-primary" }) }));
    }
    if (!user) {
        return (_jsx("div", { className: "max-w-4xl mx-auto px-4 py-6", children: _jsxs(Card, { className: "p-8 text-center", children: [_jsx("p", { className: "text-muted-foreground mb-4", children: "Voc\u00EA n\u00E3o est\u00E1 autenticado" }), _jsx(Button, { onClick: () => navigate("/login"), className: "bg-primary hover:bg-blue-700 text-white", children: "Ir para Login" })] }) }));
    }
    const handleSave = async () => {
        // TODO: Implementar atualização de perfil via tRPC
        setIsEditing(false);
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto px-4 py-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Meu Perfil" }), _jsxs(Card, { className: "p-6 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold", children: "Informa\u00E7\u00F5es Pessoais" }), !isEditing && (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setIsEditing(true), children: [_jsx(Edit2, { className: "w-4 h-4 mr-2" }), "Editar"] }))] }), isEditing ? (_jsxs("form", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Nome" }), _jsx(Input, { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "E-mail" }), _jsx(Input, { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { onClick: handleSave, className: "bg-primary hover:bg-blue-700 text-white", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Salvar"] }), _jsxs(Button, { variant: "outline", onClick: () => setIsEditing(false), children: [_jsx(X, { className: "w-4 h-4 mr-2" }), "Cancelar"] })] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Nome" }), _jsx("p", { className: "text-lg font-medium", children: user.name || "Não definido" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "E-mail" }), _jsx("p", { className: "text-lg font-medium", children: user.email || "Não definido" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Tipo de Conta" }), _jsx("p", { className: "text-lg font-medium", children: user.role === "admin" ? "Administrador" : "Usuário" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Membro desde" }), _jsx("p", { className: "text-lg font-medium", children: new Date(user.createdAt).toLocaleDateString("pt-BR") })] })] }))] }), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Seguran\u00E7a" }), _jsxs("div", { className: "space-y-4", children: [_jsx(Button, { variant: "outline", className: "w-full", children: "Alterar Senha" }), _jsx(Button, { variant: "destructive", className: "w-full", onClick: logout, children: "Sair" })] })] })] }));
}
