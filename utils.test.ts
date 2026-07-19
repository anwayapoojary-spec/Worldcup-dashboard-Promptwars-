export type Lang = "en" | "es" | "fr" | "pt" | "ar";

export const LANGUAGES: { code: Lang; label: string; native: string; rtl?: boolean }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "ar", label: "Arabic", native: "العربية", rtl: true },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.dashboard": "Dashboard",
  "nav.assistant": "AI Assistant",
  "nav.map": "Stadium Map",
  "nav.crowd": "Crowd Analytics",
  "nav.transportation": "Transportation",
  "nav.accessibility": "Accessibility",
  "nav.operations": "Operations",
  "nav.emergency": "Emergency SOS",
  "nav.sustainability": "Sustainability",
  "nav.insights": "AI Insights",
  "nav.reports": "Reports",
  "nav.settings": "Settings",
  "top.systems": "Systems nominal",
  "top.live": "Live · ARG–BRA",
  "role.label": "Role",
  "lang.label": "Language",
  "search": "Search…",
};

const es: Dict = {
  "nav.dashboard": "Panel",
  "nav.assistant": "Asistente IA",
  "nav.map": "Mapa del estadio",
  "nav.crowd": "Analítica de público",
  "nav.transportation": "Transporte",
  "nav.accessibility": "Accesibilidad",
  "nav.operations": "Operaciones",
  "nav.emergency": "Emergencia SOS",
  "nav.sustainability": "Sostenibilidad",
  "nav.insights": "Insights IA",
  "nav.reports": "Informes",
  "nav.settings": "Ajustes",
  "top.systems": "Sistemas operativos",
  "top.live": "En vivo · ARG–BRA",
  "role.label": "Rol",
  "lang.label": "Idioma",
  "search": "Buscar…",
};

const fr: Dict = {
  "nav.dashboard": "Tableau de bord",
  "nav.assistant": "Assistant IA",
  "nav.map": "Plan du stade",
  "nav.crowd": "Analyse de foule",
  "nav.transportation": "Transport",
  "nav.accessibility": "Accessibilité",
  "nav.operations": "Opérations",
  "nav.emergency": "Urgence SOS",
  "nav.sustainability": "Durabilité",
  "nav.insights": "Analyses IA",
  "nav.reports": "Rapports",
  "nav.settings": "Paramètres",
  "top.systems": "Systèmes nominaux",
  "top.live": "En direct · ARG–BRA",
  "role.label": "Rôle",
  "lang.label": "Langue",
  "search": "Rechercher…",
};

const pt: Dict = {
  "nav.dashboard": "Painel",
  "nav.assistant": "Assistente IA",
  "nav.map": "Mapa do estádio",
  "nav.crowd": "Análise de público",
  "nav.transportation": "Transporte",
  "nav.accessibility": "Acessibilidade",
  "nav.operations": "Operações",
  "nav.emergency": "Emergência SOS",
  "nav.sustainability": "Sustentabilidade",
  "nav.insights": "Insights IA",
  "nav.reports": "Relatórios",
  "nav.settings": "Configurações",
  "top.systems": "Sistemas normais",
  "top.live": "Ao vivo · ARG–BRA",
  "role.label": "Função",
  "lang.label": "Idioma",
  "search": "Buscar…",
};

const ar: Dict = {
  "nav.dashboard": "لوحة التحكم",
  "nav.assistant": "مساعد الذكاء الاصطناعي",
  "nav.map": "خريطة الملعب",
  "nav.crowd": "تحليلات الحشود",
  "nav.transportation": "النقل",
  "nav.accessibility": "إمكانية الوصول",
  "nav.operations": "العمليات",
  "nav.emergency": "طوارئ SOS",
  "nav.sustainability": "الاستدامة",
  "nav.insights": "رؤى الذكاء الاصطناعي",
  "nav.reports": "التقارير",
  "nav.settings": "الإعدادات",
  "top.systems": "الأنظمة تعمل",
  "top.live": "مباشر · ARG–BRA",
  "role.label": "الدور",
  "lang.label": "اللغة",
  "search": "بحث…",
};

export const DICTIONARIES: Record<Lang, Dict> = { en, es, fr, pt, ar };

export function translate(lang: Lang, key: string): string {
  return DICTIONARIES[lang]?.[key] ?? DICTIONARIES.en[key] ?? key;
}
