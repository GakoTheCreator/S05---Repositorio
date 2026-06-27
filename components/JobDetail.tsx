"use client";

import {
  ArrowLeft,
  Bookmark,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
} from "lucide-react";
import type { Job } from "@/lib/types";
import { STUDENT } from "@/lib/data";
import { CompanyMark } from "./JobCard";

type JobDetailProps = {
  job: Job;
  saved: boolean;
  onBack?: () => void;
  onToggleSaved: () => void;
  onApply: () => void;
  compact?: boolean;
};

export function JobDetail({ job, saved, onBack, onToggleSaved, onApply, compact = false }: JobDetailProps) {
  const compatible = STUDENT.period >= job.minPeriod;
  return (
    <section className={`job-detail ${compact ? "job-detail--compact" : ""}`}>
      {!compact ? (
        <header className="mobile-page-header job-detail-mobile-header">
          <button className="icon-button" onClick={onBack} aria-label="Voltar"><ArrowLeft size={23} /></button>
          <h1>Detalhes da vaga</h1>
          <button className={`icon-button ${saved ? "icon-button--active" : ""}`} onClick={onToggleSaved} aria-label="Salvar vaga">
            <Bookmark size={22} fill={saved ? "currentColor" : "none"} />
          </button>
        </header>
      ) : null}

      <div className="job-detail-scroll">
        <div className="detail-identity">
          <CompanyMark job={job} />
          <div><h2>{job.title}</h2><p>{job.company}</p></div>
          {compact ? (
            <button className={`save-button ${saved ? "save-button--active" : ""}`} onClick={onToggleSaved} aria-label="Salvar vaga">
              <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
            </button>
          ) : null}
        </div>

        <div className="detail-meta">
          <span><MapPin size={17} /> {job.location}</span>
          <span><Building2 size={17} /> {job.mode}</span>
          <span><Clock3 size={17} /> Inscrições até {job.deadline}</span>
        </div>

        <span className="compatibility-tag detail-tag"><CheckCircle2 size={15} /> Compatível com seu perfil</span>

        <div className={`eligibility-box ${compatible ? "" : "eligibility-box--warning"}`}>
          <span><Check size={25} /></span>
          <div>
            <strong>{compatible ? "Seu perfil atende aos requisitos" : "Confira os requisitos da vaga"}</strong>
            <p>{compatible ? "Seu curso e período são compatíveis com esta oportunidade." : "Alguns requisitos podem precisar de atenção."}</p>
          </div>
        </div>

        <div className="detail-section">
          <h3>Sobre a vaga</h3>
          <p>{job.description}</p>
        </div>

        <div className="detail-section">
          <h3>Requisitos</h3>
          <ul className="requirement-list">
            {job.requirements.map((requirement) => <li key={requirement}><CheckCircle2 size={18} /> <span>{requirement}</span></li>)}
          </ul>
        </div>

        <div className="detail-section curriculum-section">
          <div className="curriculum-heading"><h3>Seu currículo</h3><button>Trocar currículo</button></div>
          <button className="curriculum-file">
            <span className="pdf-icon"><FileText size={23} /></span>
            <span><strong>curriculo-gabriel.pdf</strong><small>Atualizado há 3 dias</small></span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="detail-action-bar">
        {!compact ? <button className="secondary-button" onClick={onToggleSaved}><Bookmark size={19} fill={saved ? "currentColor" : "none"} /> {saved ? "Salva" : "Salvar"}</button> : null}
        <button className="primary-button" onClick={onApply}>Candidatar-se</button>
      </div>
    </section>
  );
}
