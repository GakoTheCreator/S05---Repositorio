"use client";

import { ArrowLeft, BookOpen, Check, ChevronRight, FileText, LogOut, Mail, Pencil, UserRound } from "lucide-react";
import { STUDENT } from "@/lib/data";

type ProfileScreenProps = { onBack: () => void; onLogout: () => void };

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  return (
    <div className="simple-page profile-screen page-enter">
      <header className="mobile-page-header">
        <button className="icon-button" onClick={onBack} aria-label="Voltar"><ArrowLeft size={23} /></button><h1>Perfil</h1><span />
      </header>
      <div className="profile-hero">
        <span className="avatar avatar--large">{STUDENT.initials}</span>
        <div><h1>{STUDENT.name}</h1><p>{STUDENT.email}</p><span>{STUDENT.course} · {STUDENT.period}º período</span></div>
        <button className="icon-button" aria-label="Editar perfil"><Pencil size={19} /></button>
      </div>
      <div className="profile-completion"><div><strong>Perfil 80% completo</strong><span>Adicione experiências para melhorar suas recomendações.</span></div><div className="completion-track"><span /></div></div>
      <div className="profile-list">
        <button><span><UserRound size={20} /></span><div><strong>Dados pessoais</strong><small>Nome, telefone e endereço</small></div><Check size={18} /><ChevronRight size={19} /></button>
        <button><span><BookOpen size={20} /></span><div><strong>Formação acadêmica</strong><small>{STUDENT.course}</small></div><Check size={18} /><ChevronRight size={19} /></button>
        <button><span><FileText size={20} /></span><div><strong>Currículo</strong><small>curriculo-gabriel.pdf</small></div><Check size={18} /><ChevronRight size={19} /></button>
        <button><span><Mail size={20} /></span><div><strong>Preferências de vagas</strong><small>Remoto ou híbrido</small></div><ChevronRight size={19} /></button>
      </div>
      <button className="logout-button" onClick={onLogout}><LogOut size={19} /> Sair da conta</button>
    </div>
  );
}
