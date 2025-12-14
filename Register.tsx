import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: O servidor não está respondendo. Verifique sua conexão.")), 10000)
      );

      // Race the register call against the timeout
      await Promise.race([
        register(formData.name, formData.email, formData.password),
        timeoutPromise
      ]);

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err: any) {
      const code = String(err?.message || "");
      const map: Record<string, string> = {
        missing_fields: "Preencha nome, e-mail e senha",
        invalid_fields: "E-mail inválido ou senha muito curta",
        email_in_use: "E-mail já cadastrado",
        database_unavailable: "Serviço indisponível no momento. Tente novamente"
      };
      setError(map[code] || "Erro ao registrar. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 !bg-neutral-900 !border-neutral-800 text-white">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="mb-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="text-center mb-8">
          <img src={APP_LOGO} alt={APP_TITLE} className="w-20 h-20 mx-auto rounded-lg mb-4" />
          <h1 className="text-2xl font-bold">Criar Conta</h1>
          <p className="text-sm text-neutral-400">IESP</p>
        </div>

        {success && (
          <div className="p-3 bg-green-900/30 border border-green-700 rounded text-green-200 text-sm mb-6">
            Conta criada com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome Completo</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu Nome"
              required
              className="!bg-neutral-800 !border-neutral-700 text-white placeholder:text-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              className="!bg-neutral-800 !border-neutral-700 text-white placeholder:text-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="!bg-neutral-800 !border-neutral-700 text-white placeholder:text-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirmar Senha</label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="!bg-neutral-800 !border-neutral-700 text-white placeholder:text-neutral-400"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full !bg-gray-300 !text-black hover:bg-gray-200"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-6">
          Já tem conta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-gray-300 hover:underline font-medium"
          >
            Faça login
          </button>
        </p>
      </Card>
    </div>
  );
}
