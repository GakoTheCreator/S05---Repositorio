"use client";

import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  Headphones,
  History,
  MapPin,
  Megaphone,
  MessageCircle,
  Moon,
  Send,
  Sun,
  Star,
  TrendingUp,
} from "lucide-react";
import { JOBS, STUDENT } from "@/lib/data";
import type { Job, Screen, Theme } from "@/lib/types";
import { CompanyMark } from "./JobCard";
import { InatelLogo } from "./InatelLogo";

type HomeScreenProps = {
  theme: Theme;
  onToggleTheme: () => void;
  onNavigate: (screen: Screen) => void;
  onOpenJob: (job: Job) => void;
  onService: (label: string) => void;
};

const services = [
  { label: "Avisos", icon: Megaphone, badge: "2 novos" },
  { label: "Atendimento", icon: Headphones },
  { label: "Notas", icon: BookOpenCheck },
  { label: "Frequências", icon: CalendarDays },
  { label: "Histórico", icon: History },
  { label: "Avaliações", icon: Star },
];

export function HomeScreen({ theme, onToggleTheme, onNavigate, onOpenJob, onService }: HomeScreenProps) {
  const featuredJob = JOBS[0];
  const ThemeIcon = theme === "light" ? Moon : Sun;
  return (
    <div className="home-screen page-enter">
      <div className="mobile-home-header">
        <InatelLogo />
        <div className="mobile-home-actions">
          <button className="icon-button" onClick={onToggleTheme} aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}>
            <ThemeIcon size={22} />
          </button>
          <button className="icon-button notification-button" aria-label="Notificações"><Bell size={22} /><span /></button>
        </div>
      </div>

      <section className="home-hero">
        <div className="student-heading">
          <span className="avatar">{STUDENT.initials}</span>
          <div>
            <p>Olá, {STUDENT.firstName}</p>
            <h1>Precisa de ajuda com o app?</h1>
            <span>Atendimento acadêmico, avisos e serviços em um só lugar.</span>
          </div>
        </div>
        <button className="profile-progress" onClick={() => onNavigate("support")}>
          <span className="progress-ring"><Headphones size={20} /></span>
          <span><strong>Atendente virtual online</strong><small>Receba orientação e feedback imediato</small></span>
          <ChevronRight size={20} />
        </button>
      </section>

      <div className="home-grid">
        <section className="home-section assistance-section">
          <div className="section-heading-row">
            <div><p>Assistência</p><h2>Resolva sua solicitação</h2></div>
            <button className="text-link" onClick={() => onNavigate("support")}>Abrir chat <ArrowRight size={17} /></button>
          </div>
          <button className="assistant-card" onClick={() => onNavigate("support")}>
            <span className="assistant-card-icon"><MessageCircle size={30} /></span>
            <div>
              <strong>Atendimento inteligente</strong>
              <p>Descreva sua dúvida, acompanhe a resposta do assistente e envie uma mensagem para continuar o atendimento.</p>
              <span><Send size={15} /> Simula input, processamento e resposta do sistema</span>
            </div>
            <ChevronRight size={21} />
          </button>
        </section>

        <section className="home-section services-section">
          <div className="section-heading-row">
            <div><p>Acesso rápido</p><h2>Serviços do aluno</h2></div>
          </div>
          <div className="service-list">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  className="service-row"
                  key={service.label}
                  onClick={() => service.label === "Atendimento" ? onNavigate("support") : onService(service.label)}
                >
                  <span className="service-icon"><Icon size={21} /></span>
                  <strong>{service.label}</strong>
                  {service.badge ? <small>{service.badge}</small> : null}
                  <ChevronRight size={19} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="home-section opportunity-section">
          <div className="section-heading-row">
            <div><p>Complementar</p><h2>Oportunidades</h2></div>
            <button className="text-link" onClick={() => onNavigate("jobs")}>Ver todas <ArrowRight size={17} /></button>
          </div>
          <button className="featured-job" onClick={() => onOpenJob(featuredJob)}>
            <div className="featured-job-top">
              <CompanyMark job={featuredJob} />
              <div className="featured-job-title">
                <span>Compatível com seu perfil</span>
                <h3>{featuredJob.title}</h3>
                <p>{featuredJob.company}</p>
              </div>
              <ChevronRight size={21} />
            </div>
            <div className="featured-job-meta">
              <span><MapPin size={16} /> {featuredJob.location}</span>
              <span><TrendingUp size={16} /> {featuredJob.mode}</span>
              <span><Clock3 size={16} /> Até {featuredJob.deadline}</span>
            </div>
          </button>
          <div className="carousel-dots" aria-hidden="true"><span /><span /><span /></div>
        </section>

        <aside className="home-notice">
          <div><span>Último aviso</span><strong>Semana de provas</strong></div>
          <p>Confira o cronograma atualizado das avaliações no portal acadêmico.</p>
          <button onClick={() => onService("Avisos")}>Ver aviso <ChevronRight size={16} /></button>
        </aside>
      </div>
    </div>
  );
}
