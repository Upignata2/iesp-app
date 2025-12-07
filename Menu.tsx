import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ExternalLink, LogOut, User } from "lucide-react";
import { useLocation } from "wouter";

export default function Menu() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      
      {isAuthenticated && (
        <Card className="p-6 mb-6 bg-gradient-to-r from-primary to-blue-700 text-white">
          <h2 className="text-xl font-bold mb-2">Bem-vindo!</h2>
          <p className="mb-4">{user?.name || "Usuário"}</p>
          <p className="text-sm text-blue-100">{user?.email}</p>
        </Card>
      )}

      <div className="space-y-4">
        {isAuthenticated && (
          <Card className="p-4">
            <h3 className="font-bold mb-2">Minha Conta</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Meu Perfil
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-4">
          <h3 className="font-bold mb-2">Links Rápidos</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open("https://www.instagram.com", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Instagram
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open("https://www.example.com", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Site Oficial
            </Button>
          </div>
        </Card>

        {isAuthenticated && (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        )}

        {!isAuthenticated && (
          <div className="space-y-2">
            <Button 
              className="w-full bg-primary hover:bg-blue-700 text-white"
              onClick={() => navigate('/login')}
            >
              Entrar
            </Button>
            <Button 
              variant="secondary"
              className="w-full"
              onClick={() => navigate('/register')}
            >
              Registrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
