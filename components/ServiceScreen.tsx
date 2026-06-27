"use client";

import { ArrowLeft, CalendarDays, CheckCircle2, ChevronRight, Megaphone } from "lucide-react";

type ServiceScreenProps = { title: string; onBack: () => void };

export function ServiceScreen({ title, onBack }: ServiceScreenProps) {
  return (
    <div className="simple-page service-screen page-enter">
      <header className="mobile-page-header"><button className="icon-button" onClick={onBack} aria-label="Voltar"><ArrowLeft size={23} /></button><h1>{title}</h1><span /></header>
      <div className="simple-page-heading"><p>Portal do aluno</p><h1>{title}</h1><span>Conteúdo acadêmico organizado em um só lugar.</span></div>
      <div className="service-demo-card">
        <span className="service-demo-icon">{title === "Avisos" ? <Megaphone size={27} /> : <CalendarDays size={27} />}</span>
        <div><span>Atualização recente</span><h2>{title === "Avisos" ? "Cronograma da semana de provas" : `${title} disponíveis para consulta`}</h2><p>Confira as informações atualizadas publicadas pela secretaria acadêmica.</p></div>
        <ChevronRight size={21} />
      </div>
      <div className="service-demo-card service-demo-card--muted"><span className="service-demo-icon"><CheckCircle2 size={27} /></span><div><span>Em dia</span><h2>Nenhuma pendência encontrada</h2><p>Suas informações acadêmicas estão atualizadas.</p></div></div>
    </div>
  );
}
