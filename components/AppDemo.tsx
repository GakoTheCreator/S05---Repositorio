"use client";

import { useCallback, useMemo, useState } from "react";
import { Bookmark, CheckCircle2 } from "lucide-react";
import { JOBS } from "@/lib/data";
import type { Job, Screen, Theme } from "@/lib/types";
import { AppShell } from "./AppShell";
import { ApplicationFlow } from "./ApplicationFlow";
import { ApplicationsScreen } from "./ApplicationsScreen";
import { HomeScreen } from "./HomeScreen";
import { JobDetail } from "./JobDetail";
import { JobsScreen } from "./JobsScreen";
import { LoginScreen } from "./LoginScreen";
import { ProfileScreen } from "./ProfileScreen";
import { ServiceScreen } from "./ServiceScreen";
import { SupportScreen } from "./SupportScreen";

type Toast = { id: number; message: string; kind: "saved" | "success" };

export function AppDemo() {
  const [screen, setScreen] = useState<Screen>("login");
  const [theme, setTheme] = useState<Theme>("light");
  const [previousScreen, setPreviousScreen] = useState<Screen>("home");
  const [selectedJobId, setSelectedJobId] = useState(JOBS[0].id);
  const [savedIds, setSavedIds] = useState<Set<number>>(() => new Set([JOBS[0].id]));
  const [applicationJob, setApplicationJob] = useState<Job | null>(null);
  const [appliedJob, setAppliedJob] = useState<Job | null>(null);
  const [serviceTitle, setServiceTitle] = useState("Avisos");
  const [toast, setToast] = useState<Toast | null>(null);
  const selectedJob = useMemo(() => JOBS.find((job) => job.id === selectedJobId) ?? JOBS[0], [selectedJobId]);
  const toggleTheme = useCallback(() => setTheme((current) => current === "light" ? "dark" : "light"), []);

  const showToast = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = Date.now();
    setToast({ id, message, kind });
    window.setTimeout(() => setToast((current) => current?.id === id ? null : current), 2400);
  }, []);

  function navigate(nextScreen: Screen) {
    if (nextScreen === "service") {
      setServiceTitle("Avisos");
    }
    setPreviousScreen(screen === "detail" ? "jobs" : screen);
    setScreen(nextScreen);
  }

  function openJob(job: Job) {
    setSelectedJobId(job.id);
    setPreviousScreen(screen);
    setScreen("detail");
  }

  function selectJob(job: Job) {
    setSelectedJobId(job.id);
    if (window.innerWidth < 1024) {
      setPreviousScreen("jobs");
      setScreen("detail");
    }
  }

  function toggleSaved(id: number) {
    setSavedIds((current) => {
      const next = new Set(current);
      const wasSaved = next.has(id);
      if (wasSaved) next.delete(id); else next.add(id);
      showToast(wasSaved ? "Vaga removida dos salvos" : "Vaga salva para ver depois", "saved");
      return next;
    });
  }

  function openService(label: string) {
    setServiceTitle(label);
    setPreviousScreen("home");
    setScreen("service");
  }

  const content = (() => {
    switch (screen) {
      case "home":
        return <HomeScreen theme={theme} onToggleTheme={toggleTheme} onNavigate={navigate} onOpenJob={openJob} onService={openService} />;
      case "jobs":
        return (
          <JobsScreen
            selectedJob={selectedJob}
            savedIds={savedIds}
            onSelectJob={selectJob}
            onToggleSaved={toggleSaved}
            onApply={setApplicationJob}
            onBack={() => navigate("home")}
          />
        );
      case "detail":
        return (
          <div className="mobile-detail-page page-enter">
            <JobDetail
              job={selectedJob}
              saved={savedIds.has(selectedJob.id)}
              onBack={() => setScreen(previousScreen === "home" ? "home" : "jobs")}
              onToggleSaved={() => toggleSaved(selectedJob.id)}
              onApply={() => setApplicationJob(selectedJob)}
            />
          </div>
        );
      case "applications":
        return <ApplicationsScreen appliedJob={appliedJob} onNavigate={navigate} />;
      case "support":
        return <SupportScreen onBack={() => setScreen(previousScreen === "home" ? "home" : previousScreen)} />;
      case "profile":
        return <ProfileScreen onBack={() => navigate("home")} onLogout={() => setScreen("login")} />;
      case "service":
        return <ServiceScreen title={serviceTitle} onBack={() => setScreen("home")} />;
      default:
        return null;
    }
  })();

  if (screen === "login") {
    return (
      <div data-theme={theme}>
        <LoginScreen theme={theme} onToggleTheme={toggleTheme} onLogin={() => setScreen("home")} />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <AppShell theme={theme} onToggleTheme={toggleTheme} screen={screen} onNavigate={navigate}>{content}</AppShell>
      {applicationJob ? (
        <ApplicationFlow
          job={applicationJob}
          onClose={() => {
            const completed = appliedJob?.id === applicationJob.id;
            setApplicationJob(null);
            if (completed) setScreen("applications");
          }}
          onComplete={(job) => { setAppliedJob(job); showToast("Candidatura enviada com sucesso"); }}
        />
      ) : null}
      {toast ? (
        <div className="toast" role="status">
          {toast.kind === "saved" ? <Bookmark size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      ) : null}
    </div>
  );
}
