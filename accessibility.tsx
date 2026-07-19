import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LANGUAGES, translate, type Lang } from "./i18n";

export type Role =
  | "fan"
  | "volunteer"
  | "organizer"
  | "security"
  | "medical"
  | "transportation"
  | "admin";

export const ROLES: { code: Role; label: string; hint: string }[] = [
  { code: "fan", label: "Fan", hint: "Personal match-day companion" },
  { code: "volunteer", label: "Volunteer", hint: "Guide fans, resolve requests" },
  { code: "organizer", label: "Organizer", hint: "Match & venue operations" },
  { code: "security", label: "Security", hint: "Incident response & crowd" },
  { code: "medical", label: "Medical", hint: "Dispatch & triage" },
  { code: "transportation", label: "Transportation", hint: "Shuttles, rail, parking" },
  { code: "admin", label: "Admin", hint: "Full console access" },
];

export type A11yPrefs = {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
};

type Prefs = {
  role: Role;
  lang: Lang;
  a11y: A11yPrefs;
};

type Ctx = Prefs & {
  setRole: (r: Role) => void;
  setLang: (l: Lang) => void;
  setA11y: (patch: Partial<A11yPrefs>) => void;
  t: (key: string) => string;
  isRTL: boolean;
};

const defaultPrefs: Prefs = {
  role: "organizer",
  lang: "en",
  a11y: { highContrast: false, largeText: false, reduceMotion: false },
};

const PrefsContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "wcai:prefs:v1";

function readStored(): Prefs {
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPrefs;
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return {
      role: (parsed.role as Role) ?? defaultPrefs.role,
      lang: (parsed.lang as Lang) ?? defaultPrefs.lang,
      a11y: { ...defaultPrefs.a11y, ...(parsed.a11y ?? {}) },
    };
  } catch {
    return defaultPrefs;
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
    const html = document.documentElement;
    const rtl = LANGUAGES.find((l) => l.code === prefs.lang)?.rtl ?? false;
    html.setAttribute("lang", prefs.lang);
    html.setAttribute("dir", rtl ? "rtl" : "ltr");
    html.classList.toggle("a11y-hc", prefs.a11y.highContrast);
    html.classList.toggle("a11y-lg", prefs.a11y.largeText);
    html.classList.toggle("a11y-rm", prefs.a11y.reduceMotion);
  }, [prefs, hydrated]);

  const setRole = useCallback((role: Role) => setPrefs((p) => ({ ...p, role })), []);
  const setLang = useCallback((lang: Lang) => setPrefs((p) => ({ ...p, lang })), []);
  const setA11y = useCallback(
    (patch: Partial<A11yPrefs>) =>
      setPrefs((p) => ({ ...p, a11y: { ...p.a11y, ...patch } })),
    [],
  );
  const t = useCallback((key: string) => translate(prefs.lang, key), [prefs.lang]);
  const isRTL = useMemo(
    () => LANGUAGES.find((l) => l.code === prefs.lang)?.rtl ?? false,
    [prefs.lang],
  );

  const value: Ctx = {
    ...prefs,
    setRole,
    setLang,
    setA11y,
    t,
    isRTL,
  };
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): Ctx {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside PrefsProvider");
  return ctx;
}

// Which nav items each role sees. Admin sees all.
export const ROLE_NAV: Record<Role, string[]> = {
  fan: ["/", "/assistant", "/navigation", "/transportation", "/accessibility", "/emergency"],
  volunteer: ["/", "/assistant", "/navigation", "/accessibility", "/operations", "/emergency"],
  organizer: ["/", "/stadium", "/navigation", "/transportation", "/operations", "/insights", "/sustainability", "/reports", "/settings"],
  security: ["/", "/operations", "/emergency", "/stadium", "/navigation", "/insights"],
  medical: ["/", "/operations", "/emergency", "/accessibility", "/navigation"],
  transportation: ["/", "/transportation", "/navigation", "/insights", "/reports"],
  admin: ["/", "/assistant", "/navigation", "/stadium", "/transportation", "/accessibility", "/operations", "/emergency", "/sustainability", "/insights", "/reports", "/settings"],
};
