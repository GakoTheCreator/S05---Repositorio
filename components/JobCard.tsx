"use client";

import { Bookmark, Building2, CheckCircle2, Clock3, MapPin } from "lucide-react";
import type { Job } from "@/lib/types";

type CompanyMarkProps = { job: Job };

export function CompanyMark({ job }: CompanyMarkProps) {
  return <span className={`company-mark company-mark--${job.companyTone}`}>{job.companyCode}</span>;
}

type JobCardProps = {
  job: Job;
  selected?: boolean;
  saved: boolean;
  onSelect: () => void;
  onToggleSaved: () => void;
};

export function JobCard({ job, selected = false, saved, onSelect, onToggleSaved }: JobCardProps) {
  return (
    <article
      className={`job-card ${selected ? "job-card--selected" : ""}`}
      onClick={onSelect}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(); }}
      role="button"
      tabIndex={0}
      aria-label={`Abrir vaga ${job.title}`}
    >
      <div className="job-card-top">
        <CompanyMark job={job} />
        <div className="job-card-heading">
          <h3>{job.title}</h3>
          <p>{job.company}</p>
        </div>
        <button
          className={`save-button ${saved ? "save-button--active" : ""}`}
          onClick={(event) => { event.stopPropagation(); onToggleSaved(); }}
          aria-label={saved ? "Remover dos salvos" : "Salvar vaga"}
        >
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="job-card-meta">
        <span><MapPin size={15} /> {job.location}</span>
        <span><Building2 size={15} /> {job.mode}</span>
        <span><Clock3 size={15} /> Até {job.deadline}</span>
      </div>
      <div className="job-card-tags">
        <span className="compatibility-tag"><CheckCircle2 size={14} /> Compatível com seu perfil</span>
        {job.isNew ? <span className="new-tag">Novo</span> : null}
      </div>
    </article>
  );
}
