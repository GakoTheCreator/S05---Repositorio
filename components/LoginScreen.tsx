"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Moon, ShieldCheck, Sun, UserRound } from "lucide-react";
import type { Theme } from "@/lib/types";
import { InatelLogo } from "./InatelLogo";

type LoginScreenProps = {
  theme: Theme;
  onToggleTheme: () => void;
  onLogin: () => void;
};

export function LoginScreen({ theme, onToggleTheme, onLogin }: LoginScreenProps) {
  const [registration, setRegistration] = useState("20231234");
  const [password, setPassword] = useState("inatel2026");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ThemeIcon = theme === "light" ? Moon : Sun;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!registration.trim() || !password.trim()) {
      setError("Preencha sua matrícula e senha para continuar.");
      return;
    }
    setBusy(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 650));
    onLogin();
  }

  return (
    <main className="login-screen">
      <section className="login-brand-panel" aria-label="Apresentação do Inatel Conecta">
        <InatelLogo inverse />
        <div className="login-brand-copy">
          <p className="login-brand-label">Portal do aluno</p>
          <h1>Seu próximo passo começa aqui.</h1>
          <p>Vida acadêmica, atendimento e oportunidades profissionais em uma experiência única.</p>
        </div>
        <div className="login-network" aria-hidden="true">
          <span className="network-dot network-dot--one" />
          <span className="network-dot network-dot--two" />
          <span className="network-dot network-dot--three" />
          <span className="network-line network-line--one" />
          <span className="network-line network-line--two" />
        </div>
        <p className="login-security"><ShieldCheck size={18} /> Ambiente acadêmico seguro</p>
      </section>

      <section className="login-form-panel">
        <div className="login-mobile-logo">
          <InatelLogo />
          <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}>
            <ThemeIcon size={18} />
            <span>{theme === "light" ? "Escuro" : "Claro"}</span>
          </button>
        </div>
        <form className="login-card" onSubmit={submit}>
          <div className="login-heading">
            <p>Bem-vindo de volta</p>
            <h2>Acesse sua conta</h2>
            <span>Use suas credenciais acadêmicas para continuar.</span>
          </div>

          <label className="field-label" htmlFor="registration">Matrícula</label>
          <div className="input-shell">
            <UserRound size={20} aria-hidden="true" />
            <input
              id="registration"
              inputMode="numeric"
              autoComplete="username"
              value={registration}
              onChange={(event) => setRegistration(event.target.value)}
              placeholder="Digite sua matrícula"
            />
          </div>

          <div className="field-row">
            <label className="field-label" htmlFor="password">Senha</label>
            <button className="text-button" type="button">Esqueci minha senha</button>
          </div>
          <div className="input-shell">
            <LockKeyhole size={20} aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
            />
            <button
              className="input-icon-button"
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error ? <p className="form-error" role="alert">{error}</p> : null}

          <button className="primary-button login-button" type="submit" disabled={busy}>
            <span>{busy ? "Entrando..." : "Entrar"}</span>
            {busy ? <span className="spinner" aria-hidden="true" /> : <ArrowRight size={20} />}
          </button>
          <p className="demo-hint">Use as credenciais preenchidas para acessar.</p>
        </form>
        <p className="login-footer">© 2026 Instituto Nacional de Telecomunicações</p>
      </section>
    </main>
  );
}
