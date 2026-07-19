import { useEffect, useState } from "react";

export type Density = "low" | "medium" | "busy" | "critical";

export const densityMeta: Record<Density, { label: string; color: string; bg: string }> = {
  low: { label: "Low", color: "text-emerald-300", bg: "bg-emerald-500/20 border-emerald-400/40" },
  medium: { label: "Medium", color: "text-yellow-300", bg: "bg-yellow-500/20 border-yellow-400/40" },
  busy: { label: "Busy", color: "text-orange-300", bg: "bg-orange-500/20 border-orange-400/40" },
  critical: { label: "Critical", color: "text-red-300", bg: "bg-red-500/20 border-red-400/40" },
};

export function densityFromPct(p: number): Density {
  if (p < 45) return "low";
  if (p < 70) return "medium";
  if (p < 88) return "busy";
  return "critical";
}

export type Gate = { id: string; name: string; pct: number; waitMin: number };
export type StadiumSnapshot = {
  occupancyPct: number;
  gates: Gate[];
  seriesOccupancy: { t: string; v: number }[];
  seriesFlow: { t: string; entries: number; exits: number }[];
  zones: { name: string; pct: number }[];
};

function rand(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

function baseSnapshot(): StadiumSnapshot {
  const now = Date.now();
  const series = Array.from({ length: 12 }, (_, i) => {
    const t = new Date(now - (11 - i) * 5 * 60_000);
    return {
      t: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      v: Math.min(96, 40 + i * 4 + rand(-3, 3)),
    };
  });
  const flow = series.map((s) => ({
    t: s.t,
    entries: rand(180, 420),
    exits: rand(20, 90),
  }));
  return {
    occupancyPct: series[series.length - 1].v,
    gates: [
      { id: "A", name: "Gate A · VIP", pct: rand(30, 60), waitMin: rand(2, 8) },
      { id: "B", name: "Gate B · Main", pct: rand(75, 96), waitMin: rand(12, 28) },
      { id: "C", name: "Gate C · Family", pct: rand(45, 70), waitMin: rand(5, 14) },
      { id: "D", name: "Gate D · Accessible", pct: rand(20, 50), waitMin: rand(2, 6) },
    ],
    seriesOccupancy: series,
    seriesFlow: flow,
    zones: [
      { name: "North Concourse", pct: rand(50, 90) },
      { name: "South Concourse", pct: rand(40, 85) },
      { name: "East Food Court", pct: rand(60, 95) },
      { name: "West Merch", pct: rand(30, 70) },
      { name: "Family Zone", pct: rand(30, 65) },
    ],
  };
}

export function useLiveStadium(intervalMs = 4000) {
  const [snap, setSnap] = useState<StadiumSnapshot>(() => baseSnapshot());
  useEffect(() => {
    const id = setInterval(() => setSnap(baseSnapshot()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return snap;
}

export const MATCH_SCHEDULE = [
  { id: 1, date: "Jun 18", time: "20:00", teams: "Argentina vs Brazil", stage: "Group A", status: "Today" },
  { id: 2, date: "Jun 21", time: "17:00", teams: "Germany vs Japan", stage: "Group B", status: "Upcoming" },
  { id: 3, date: "Jun 24", time: "20:00", teams: "France vs Morocco", stage: "Group C", status: "Upcoming" },
  { id: 4, date: "Jun 28", time: "16:00", teams: "Spain vs Portugal", stage: "Round of 16", status: "Upcoming" },
  { id: 5, date: "Jul 12", time: "20:00", teams: "TBD vs TBD", stage: "Final", status: "Upcoming" },
];
