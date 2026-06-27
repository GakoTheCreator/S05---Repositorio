"use client";

import { useEffect, useState } from "react";
import { Check, CheckCircle2, FileText, ShieldCheck, X } from "lucide-react";
import type { Job } from "@/lib/types";

type ApplicationFlowProps = {
  job: Job;
  onClose: () => void;
  onComplete: (job: Job) => void;
};

type Step = "review" | "processing" | "success";

export function ApplicationFlow({ job, onClose, onComplete }: ApplicationFlowProps) {
  const [step, setStep] = useState<Step>("review");

  useEffect(() => {
    if (step !== "processing") return;
    const timeout = window.setTimeout(() => {
      onComplete(job);
      setStep("success");
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [job, onComplete, step]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && step !== "processing") onClose(); }}>
      <section className="application-modal" role="dialog" aria-modal="true" aria-labelledby="application-title">
        {step === "review" ? (
          <>
            <div className="modal-handle" />
            <header className="modal-header">
              <div><span>Etapa final</span><h2 id="application-title">Revise sua candidatura</h2></div>
              <button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={21} /></button>
            </header>
            <div className="application-job-summary">
              <strong>{job.title}</strong><span>{job.company}</span>
            </div>
            <div className="review-list">
              <div><span className="review-icon"><FileText size={21} /></span><span><strong>Currículo</strong><small>curriculo-gabriel.pdf</small></span><CheckCircle2 size={19} /></div>
              <div><span className="review-icon"><ShieldCheck size={21} /></span><span><strong>Dados do perfil</strong><small>Curso e período serão compartilhados</small></span><CheckCircle2 size={19} /></div>
            </div>
            <label className="consent-row"><input type="checkbox" defaultChecked /><span>Confirmo que minhas informações estão corretas.</span></label>
            <button className="primary-button modal-primary" onClick={() => setStep("processing")}>Enviar candidatura</button>
          </>
        ) : null}

        {step === "processing" ? (
          <div className="processing-state" aria-live="polite">
            <span className="processing-ring"><span /></span>
            <h2 id="application-title">Enviando sua candidatura</h2>
            <p>Estamos validando seus dados e anexando o currículo.</p>
            <div className="processing-steps"><span><Check size={15} /> Perfil validado</span><span className="processing-steps--active">Enviando currículo...</span></div>
          </div>
        ) : null}

        {step === "success" ? (
          <div className="success-state" aria-live="polite">
            <span className="success-icon"><Check size={37} /></span>
            <span className="success-label">Candidatura enviada</span>
            <h2 id="application-title">Boa sorte, Gabriel!</h2>
            <p>Sua candidatura para <strong>{job.title}</strong> foi enviada com sucesso.</p>
            <div className="success-note">Você receberá atualizações pelo app e pelo e-mail acadêmico.</div>
            <button className="primary-button" onClick={onClose}>Acompanhar candidatura</button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
