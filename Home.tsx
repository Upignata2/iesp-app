import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Newspaper, Calendar, Music, Heart, Users, MessageSquare, Gift, Video, Star, Menu, Globe, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated, initialized, logout } = useAuth();
  const [, navigate] = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate("/login");
    }
  }, [initialized, isAuthenticated, navigate]);

  const menuItems = [
    { id: 1, label: "Artigos", icon: BookOpen, color: "bg-blue-500", route: "/articles" },
    { id: 2, label: "Notícias", icon: Newspaper, color: "bg-blue-600", route: "/news" },
    { id: 3, label: "Eventos", icon: Calendar, color: "bg-blue-700", route: "/events" },
    { id: 4, label: "Hinário", icon: Music, color: "bg-indigo-500", route: "/hymns" },
    { id: 5, label: "Palavra do Dia", icon: Heart, color: "bg-indigo-600", route: "/daily-word" },
    { id: 6, label: "Motivo de Oração", icon: Users, color: "bg-indigo-700", route: "/prayer-reasons" },
    { id: 7, label: "Horário dos Cultos", icon: Calendar, color: "bg-purple-500", route: "/service-schedules" },
    { id: 8, label: "Fale Conosco", icon: MessageSquare, color: "bg-purple-600", route: "/contact" },
    { id: 9, label: "Campanhas", icon: Gift, color: "bg-purple-700", route: "/campaigns" },
    { id: 10, label: "Galeria", icon: Video, color: "bg-pink-500", route: "/gallery" },
    { id: 11, label: "Site", icon: Globe, color: "bg-slate-600", route: "external:https://instagram.com/" },
    { id: 12, label: "Instagram", icon: Instagram, color: "bg-slate-700", route: "external:https://instagram.com/" },
  ];

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleClick = (route: string) => {
    if (route.startsWith("external:")) {
      const url = route.replace("external:", "");
      window.open(url, "_blank");
    } else {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
          {isAuthenticated && (
            <Button
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white ring-1 ring-white/20"
              variant="outline"
              size="sm"
              onClick={async () => {
                await logout();
                navigate("/login", { replace: true } as any);
              }}
            >
              Sair
            </Button>
          )}
          <div className="mx-1 mb-6 text-center text-white">
            <div className="text-5xl font-bold tracking-wide">IESP</div>
          </div>
          {!isAuthenticated ? (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3">
                <Button size="lg" className="bg-white text-blue-700" onClick={() => navigate('/login')}>Login</Button>
                <Button size="lg" variant="secondary" className="bg-white/90 text-blue-700" onClick={() => navigate('/register')}>Registrar</Button>
              </div>
            </div>
          ) : (
            <div className="hidden" />
          )}

          <div className="grid grid-cols-3 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => handleClick(item.route)} className="group flex flex-col items-center gap-3 transition-transform hover:scale-105">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-white shadow-lg">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs text-white/80">{item.label}</span>
                </button>
              );
            })}
          </div>
      </div>
    </div>
  );
}
