"use client";

import { ArrowLeft, BriefcaseBusiness, Check, ChevronRight, Clock3, FileCheck2, Send } from "lucide-react";
import type { Job, Screen } from "@/lib/types";
import { CompanyMark } from "./JobCard";

type ApplicationsScreenProps = {
  appliedJob: Job | null;
  onNavigate: (screen: Screen) => void;
};

export function ApplicationsScreen({ appliedJob, onNavigate }: ApplicationsScreenProps) {
  return (
    <div className="simple-page applications-screen page-enter">
      <header className="mobile-page-header">
        <button className="icon-button" onClick={() => onNavigate("home")} aria-label="Voltar"><ArrowLeft size={23} /></button>
        <h1>Candidaturas</h1><span />
      </header>
      <div className="simple-page-heading"><p>Carreira</p><h1>Suas candidaturas</h1><span>Acompanhe cada etapa dos processos seletivos.</span></div>

      {appliedJob ? (
        <div className="application-tracker">
          <div className="application-tracker-head">
            <CompanyMark job={appliedJob} />
            <div><span>Em análise</span><h2>{appliedJob.title}</h2><p>{appliedJob.company}</p></div>
            <ChevronRight size={21} />
          </div>
          <div className="status-timeline">
            <div className="timeline-step timeline-step--complete"><span><Check size={15} /></span><div><strong>Candidatura enviada</strong><small>Hoje, 14:32</small></div></div>
            <div className="timeline-step timeline-step--current"><span><Clock3 size={15} /></span><div><strong>Análise da empresa</strong><small>Em andamento</small></div></div>
            <div className="timeline-step"><span><BriefcaseBusiness size={15} /></span><div><strong>Próximas etapas</strong><small>A empresa entrará em contato</small></div></div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <span><FileCheck2 size={31} /></span>
          <h2>Você ainda não se candidatou</h2>
          <p>Explore oportunidades compatíveis com seu perfil e dê o próximo passo na sua carreira.</p>
          <button className="primary-button" onClick={() => onNavigate("jobs")}><Send size={18} /> Explorar vagas</button>
        </div>
      )}
    </div>
  );
}
