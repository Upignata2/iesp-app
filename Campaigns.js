import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import DonationWidget from "@/DonationWidget";
export default function Campaigns() {
    const [, navigate] = useLocation();
    const [selectedId, setSelectedId] = useState(null);
    const { data: campaigns, isLoading } = trpc.campaigns.list.useQuery({ limit: 50 });
    const { data: campaign } = trpc.campaigns.getById.useQuery({ id: selectedId }, { enabled: selectedId !== null });
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Loader2, { className: "animate-spin w-8 h-8 text-primary" }) }));
    }
    if (selectedId && campaign) {
        const progress = campaign.goal ? (campaign.collected / campaign.goal) * 100 : 0;
        return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-6", children: [_jsxs(Button, { variant: "ghost", onClick: () => setSelectedId(null), className: "mb-4", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Voltar"] }), _jsxs("article", { className: "bg-[#D2D7DB] rounded-lg shadow-lg p-6", children: [campaign.imageUrl && (_jsx("img", { src: campaign.imageUrl, alt: campaign.title, className: "w-full h-96 object-cover rounded-lg mb-6" })), _jsx("h1", { className: "text-3xl font-bold mb-2", children: campaign.title }), campaign.description && (_jsx("p", { className: "text-lg text-muted-foreground mb-4", children: campaign.description })), campaign.goal && (_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { className: "font-semibold", children: "Arrecadado" }), _jsxs("span", { className: "text-primary font-bold", children: [Math.round(progress), "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-4", children: _jsx("div", { className: "bg-primary h-4 rounded-full transition-all", style: { width: `${progress}%` } }) }), _jsxs("div", { className: "flex justify-between mt-2 text-sm text-muted-foreground", children: [_jsxs("span", { children: ["R$ ", campaign.collected] }), _jsxs("span", { children: ["R$ ", campaign.goal] })] })] })), campaign.content && (_jsx("div", { className: "prose max-w-none mb-6", children: campaign.content })), _jsx(DonationWidget, { campaignId: campaign.id, campaignTitle: campaign.title })] })] }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Campanhas" }), _jsx("div", { className: "grid gap-4", children: campaigns?.map((campaign) => {
                    const progress = campaign.goal ? (campaign.collected / campaign.goal) * 100 : 0;
                    return (_jsx(Card, { className: "p-4 cursor-pointer hover:shadow-lg transition-all", onClick: () => setSelectedId(campaign.id), children: _jsxs("div", { className: "flex gap-4", children: [campaign.imageUrl && (_jsx("img", { src: campaign.imageUrl, alt: campaign.title, className: "w-24 h-24 object-cover rounded" })), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-bold text-lg", children: campaign.title }), campaign.description && (_jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: campaign.description })), campaign.goal && (_jsxs("div", { className: "mt-2", children: [_jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-primary h-2 rounded-full", style: { width: `${progress}%` } }) }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [Math.round(progress), "% arrecadado"] })] }))] })] }) }, campaign.id));
                }) })] }));
}
