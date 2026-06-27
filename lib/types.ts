export type Screen =
  | "login"
  | "home"
  | "jobs"
  | "detail"
  | "applications"
  | "support"
  | "profile"
  | "service";

export type Theme = "light" | "dark";

export type WorkMode = "Híbrido" | "Remoto" | "Presencial";

export type Job = {
  id: number;
  title: string;
  company: string;
  companyCode: string;
  companyTone: "blue" | "navy" | "light" | "violet" | "teal";
  location: string;
  mode: WorkMode;
  deadline: string;
  course: string;
  minPeriod: number;
  type: string;
  isNew?: boolean;
  description: string;
  requirements: string[];
};
