import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
export default function Articles() {
    const [, navigate] = useLocation();
    const [selectedId, setSelectedId] = useState(null);
    const { data: articles, isLoading } = trpc.articles.list.useQuery({ limit: 50 });
    const { data: article } = trpc.articles.getById.useQuery({ id: selectedId }, { enabled: selectedId !== null });
    const { data: favorites } = trpc.favorites.list.useQuery();
    const isFavorited = favorites?.some((fav) => fav.contentType === "article" && fav.contentId === selectedId);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Loader2, { className: "animate-spin w-8 h-8 text-primary" }) }));
    }
    if (selectedId && article) {
        return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-6", children: [_jsxs(Button, { variant: "ghost", onClick: () => setSelectedId(null), className: "mb-4", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Voltar"] }), _jsxs("article", { className: "bg-white rounded-lg shadow-lg p-6", children: [article.imageUrl && (_jsx("img", { src: article.imageUrl, alt: article.title, className: "w-full h-96 object-cover rounded-lg mb-6" })), _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: article.title }), article.description && (_jsx("p", { className: "text-lg text-muted-foreground mb-4", children: article.description }))] }), _jsx(FavoriteButton, { contentType: "article", contentId: article.id, isFavorited: isFavorited })] }), _jsx("div", { className: "prose max-w-none", children: article.content })] })] }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Artigos" }), _jsx("div", { className: "grid gap-4", children: articles?.map((article) => {
                    const isFav = favorites?.some((fav) => fav.contentType === "article" && fav.contentId === article.id);
                    return (_jsx(Card, { className: "p-4 cursor-pointer hover:shadow-lg transition-all", onClick: () => setSelectedId(article.id), children: _jsxs("div", { className: "flex gap-4", children: [article.imageUrl && (_jsx("img", { src: article.imageUrl, alt: article.title, className: "w-24 h-24 object-cover rounded" })), _jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg", children: article.title }), article.description && (_jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: article.description }))] }), _jsx(FavoriteButton, { contentType: "article", contentId: article.id, isFavorited: isFav })] }) })] }) }, article.id));
                }) })] }));
}
