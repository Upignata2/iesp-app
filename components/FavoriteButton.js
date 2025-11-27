import { jsx as _jsx } from "react/jsx-runtime";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
export default function FavoriteButton({ contentType, contentId, isFavorited = false, onToggle, }) {
    const [isLiked, setIsLiked] = useState(isFavorited);
    const addFavoriteMutation = trpc.favorites.add.useMutation({
        onSuccess: () => {
            setIsLiked(true);
            onToggle?.(true);
        },
    });
    const removeFavoriteMutation = trpc.favorites.remove.useMutation({
        onSuccess: () => {
            setIsLiked(false);
            onToggle?.(false);
        },
    });
    const handleToggle = () => {
        if (isLiked) {
            removeFavoriteMutation.mutate({ contentType, contentId });
        }
        else {
            addFavoriteMutation.mutate({ contentType, contentId });
        }
    };
    return (_jsx(Button, { variant: "ghost", size: "sm", onClick: handleToggle, disabled: addFavoriteMutation.isPending || removeFavoriteMutation.isPending, className: isLiked ? "text-red-500" : "text-muted-foreground", children: _jsx(Heart, { className: `w-5 h-5 ${isLiked ? "fill-current" : ""}` }) }));
}
