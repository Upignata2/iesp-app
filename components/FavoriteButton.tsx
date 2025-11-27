import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

interface FavoriteButtonProps {
  contentType: "article" | "news" | "event" | "hymn";
  contentId: number;
  isFavorited?: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({
  contentType,
  contentId,
  isFavorited = false,
  onToggle,
}: FavoriteButtonProps) {
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
    } else {
      addFavoriteMutation.mutate({ contentType, contentId });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
      className={isLiked ? "text-red-500" : "text-muted-foreground"}
    >
      <Heart
        className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
      />
    </Button>
  );
}
