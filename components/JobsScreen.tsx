"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, Filter, GraduationCap, House, Search, SlidersHorizontal, X } from "lucide-react";
import type { Job } from "@/lib/types";
import { JOBS } from "@/lib/data";
import { JobCard } from "./JobCard";
import { JobDetail } from "./JobDetail";

type JobsScreenProps = {
  selectedJob: Job;
  savedIds: Set<number>;
  onSelectJob: (job: Job) => void;
  onToggleSaved: (id: number) => void;
  onApply: (job: Job) => void;
  onBack: () => void;
};

export function JobsScreen({ selectedJob, savedIds, onSelectJob, onToggleSaved, onApply, onBack }: JobsScreenProps) {
  const [search, setSearch] = useState("");
  const [courseOnly, setCourseOnly] = useState(true);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return JOBS.filter((job) => {
      const matchesSearch = !query || `${job.title} ${job.company}`.toLocaleLowerCase("pt-BR").includes(query);
      const matchesCourse = !courseOnly || job.course === "Engenharia de Software";
      const matchesRemote = !remoteOnly || job.mode === "Remoto";
      return matchesSearch && matchesCourse && matchesRemote;
    });
  }, [courseOnly, remoteOnly, search]);

  return (
    <div className="jobs-screen page-enter">
      <section className="jobs-results-pane">
        <header className="mobile-page-header jobs-mobile-header">
          <button className="icon-button" onClick={onBack} aria-label="Voltar"><ArrowLeft size={23} /></button>
          <h1>Vagas</h1>
          <span />
        </header>

        <div className="jobs-heading">
          <h1>Encontre sua próxima oportunidade</h1>
          <p>Busque vagas compatíveis com seu curso e perfil.</p>
        </div>

        <label className="search-field">
          <Search size={21} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar vaga ou empresa" aria-label="Buscar vaga ou empresa" />
          {search ? <button onClick={() => setSearch("")} aria-label="Limpar busca"><X size={18} /></button> : null}
        </label>

        <div className="filter-row">
          <button className={!courseOnly && !remoteOnly ? "filter-button--active" : ""} onClick={() => { setCourseOnly(false); setRemoteOnly(false); }}>
            <SlidersHorizontal size={18} /> Todas
          </button>
          <button className={courseOnly ? "filter-button--active" : ""} onClick={() => setCourseOnly((value) => !value)}>
            <GraduationCap size={18} /> Meu curso {courseOnly ? <Check size={15} /> : null}
          </button>
          <button className={remoteOnly ? "filter-button--active" : ""} onClick={() => setRemoteOnly((value) => !value)}>
            <House size={18} /> Remoto
          </button>
          <button onClick={() => setFiltersOpen((value) => !value)}>
            <Filter size={18} /> Filtros <span className="filter-count">2</span>
          </button>
        </div>

        {filtersOpen ? (
          <div className="filter-panel">
            <div><strong>Tipo de oportunidade</strong><span>Estágio e vagas júnior</span></div>
            <div><strong>Período</strong><span>A partir do seu período atual</span></div>
            <button onClick={() => setFiltersOpen(false)}>Aplicar filtros</button>
          </div>
        ) : null}

        <div className="results-heading">
          <strong>{filteredJobs.length} {filteredJobs.length === 1 ? "oportunidade" : "oportunidades"}</strong>
          <button>Mais recentes <ChevronDown size={17} /></button>
        </div>

        <div className="job-list">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              selected={job.id === selectedJob.id}
              saved={savedIds.has(job.id)}
              onSelect={() => onSelectJob(job)}
              onToggleSaved={() => onToggleSaved(job.id)}
            />
          ))}
          {!filteredJobs.length ? (
            <div className="empty-results"><Search size={28} /><strong>Nenhuma vaga encontrada</strong><p>Tente ajustar sua busca ou remover alguns filtros.</p></div>
          ) : null}
        </div>
      </section>

      <aside className="desktop-detail-pane">
        <JobDetail
          job={selectedJob}
          saved={savedIds.has(selectedJob.id)}
          onToggleSaved={() => onToggleSaved(selectedJob.id)}
          onApply={() => onApply(selectedJob)}
          compact
        />
      </aside>
    </div>
  );
}
