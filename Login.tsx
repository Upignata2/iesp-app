import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Login() {
  const [, navigate] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted");
    setIsLoading(true);
    setError("");

    try {
      console.log("Calling login API...");
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: O servidor não está respondendo. Verifique sua conexão.")), 10000)
      );

      // Race the login call against the timeout
      await Promise.race([login(email, password), timeoutPromise]);
      
      console.log("Login successful, navigating to home");
      navigate("/home");
    } catch (err: any) {
      console.error("Login failed:", err);
      const code = String(err?.message || "");
      const map: Record<string, string> = {
        invalid_credentials: "Credenciais inválidas",
        database_unavailable: "Serviço indisponível no momento. Tente novamente",
      };
      setError(map[code] || "Falha ao fazer login: " + code);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-neutral-900 border-neutral-800 text-white">
        <div className="text-center mb-8">
          <img src={APP_LOGO} alt={APP_TITLE} className="w-20 h-20 mx-auto rounded-lg mb-4" />
          <h1 className="text-2xl font-bold">IESP</h1>
          <p className="text-sm text-muted-foreground">Igreja Evangélica Sinais e Prodígios</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-300 text-black hover:bg-gray-200"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-300">
          Não tem conta?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-white hover:underline font-medium"
          >
            Registre-se
          </button>
        </p>

        <p className="text-center text-sm text-neutral-300 mt-4">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-white hover:underline"
          >
            Esqueceu sua senha?
          </button>
        </p>

        <div className="mt-6">
          <Button variant="ghost" className="w-full text-white" onClick={() => navigate('/home')}>Continuar sem login</Button>
        </div>
      </Card>
    </div>
  );
}
