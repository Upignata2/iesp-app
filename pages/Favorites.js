import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
export default function Favorites() {
    const { data: favorites } = trpc.favorites.list.useQuery();
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Favoritos" }), _jsxs("div", { className: "grid gap-4", children: [(favorites || []).map((fav) => (_jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: fav.contentType }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["ID: ", fav.contentId] })] }), _jsx(Button, { variant: "secondary", size: "sm", children: "Abrir" })] }) }, `${fav.contentType}-${fav.contentId}`))), (!favorites || favorites.length === 0) && (_jsx(Card, { className: "p-6 text-center text-muted-foreground", children: "Nenhum favorito ainda" }))] })] }));
}
