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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Você não está autenticado</p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-blue-700 text-white"
          >
            Ir para Login
          </Button>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    // TODO: Implementar atualização de perfil via tRPC
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Informações Pessoais</h2>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>

        {isEditing ? (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">E-mail</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="text-lg font-medium">{user.name || "Não definido"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p className="text-lg font-medium">{user.email || "Não definido"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Conta</p>
              <p className="text-lg font-medium">
                {user.role === "admin" ? "Administrador" : "Usuário"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Membro desde</p>
              <p className="text-lg font-medium">
                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Segurança</h2>
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            Alterar Senha
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={logout}
          >
            Sair
          </Button>
        </div>
      </Card>
    </div>
  );
}
