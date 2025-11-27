import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
export default function DonationWidget({ campaignId, campaignTitle }) {
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("pix");
    const [showForm, setShowForm] = useState(false);
    const donateMutation = trpc.campaigns.donate.useMutation({
        onSuccess: () => {
            alert("Doação realizada com sucesso! Obrigado por sua contribuição.");
            setAmount("");
            setShowForm(false);
        },
        onError: () => {
            alert("Erro ao processar doação. Tente novamente.");
        },
    });
    const handleDonate = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("Por favor, insira um valor válido");
            return;
        }
        donateMutation.mutate({
            campaignId,
            amount: Math.round(parseFloat(amount) * 100),
            paymentMethod,
        });
    };
    if (!showForm) {
        return (_jsx(Button, { onClick: () => setShowForm(true), className: "w-full bg-primary hover:bg-blue-700 text-white", children: "Fazer Doa\u00E7\u00E3o" }));
    }
    return (_jsxs(Card, { className: "p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-primary", children: [_jsxs("h3", { className: "font-bold text-lg mb-4", children: ["Fazer Doa\u00E7\u00E3o para ", campaignTitle] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Valor (R$)" }), _jsx(Input, { type: "number", step: "0.01", min: "0", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "Ex: 50,00" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "M\u00E9todo de Pagamento" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", name: "payment", value: "pix", checked: paymentMethod === "pix", onChange: (e) => setPaymentMethod(e.target.value), className: "mr-2" }), _jsx("span", { children: "PIX" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", name: "payment", value: "mercadopago", checked: paymentMethod === "mercadopago", onChange: (e) => setPaymentMethod(e.target.value), className: "mr-2" }), _jsx("span", { children: "Mercado Pago" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", name: "payment", value: "credit_card", checked: paymentMethod === "credit_card", onChange: (e) => setPaymentMethod(e.target.value), className: "mr-2" }), _jsx("span", { children: "Cart\u00E3o de Cr\u00E9dito" })] })] })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800", children: [_jsx("p", { className: "font-semibold mb-1", children: "Informa\u00E7\u00F5es Importantes:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "Sua doa\u00E7\u00E3o \u00E9 segura e criptografada" }), _jsx("li", { children: "Voc\u00EA receber\u00E1 um comprovante por e-mail" }), _jsx("li", { children: "100% do valor vai para a campanha" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { onClick: handleDonate, disabled: donateMutation.isPending || !amount, className: "flex-1 bg-primary hover:bg-blue-700 text-white", children: [donateMutation.isPending && (_jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" })), "Confirmar Doa\u00E7\u00E3o"] }), _jsx(Button, { variant: "outline", onClick: () => setShowForm(false), className: "flex-1", children: "Cancelar" })] })] })] }));
}
