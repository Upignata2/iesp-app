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
  const { login, isAuthenticated, initialized } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialized && isAuthenticated) {
      window.location.href = "/home";
    }
  }, [initialized, isAuthenticated, navigate]);

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
      window.location.href = "/home";
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
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      <div className="absolute top-6 left-0 right-0 text-center">
        <img 
          src={APP_LOGO} 
          alt={APP_TITLE}
          className="w-20 h-20 mx-auto rounded-xl mb-2 shadow-lg"
          onError={(e) => { e.currentTarget.src = "/iesp-logo.svg"; }}
        />
        <div className="text-sm opacity-80">IESP</div>
      </div>
      <Card className="w-full max-w-md p-8 bg-white border border-neutral-300 text-black rounded-2xl shadow-xl">
        <h2 className="text-center text-sm font-semibold text-neutral-600 mb-6">LOGIN</h2>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-white border-neutral-300 text-black placeholder:text-neutral-500 rounded-xl"
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
              className="bg-white border-neutral-300 text-black placeholder:text-neutral-500 rounded-xl"
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs text-neutral-600 hover:text-black underline"
              >
                Esqueceu minha senha.
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-white/90 rounded-xl"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Acessar
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-600">
          Não tem conta?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-black hover:underline font-medium"
          >
            Registre-se
          </button>
        </p>

      </Card>
    </div>
  );
}
