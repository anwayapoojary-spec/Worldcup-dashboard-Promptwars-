export type PoiCategory =
  | "seat"
  | "restroom"
  | "food"
  | "medical"
  | "prayer"
  | "charging"
  | "merch"
  | "water"
  | "exit"
  | "wheelchair"
  | "family";

export type Poi = {
  id: string;
  name: string;
  category: PoiCategory;
  x: number;
  y: number;
};

// Coords in a 600x400 SVG viewBox
export const POIS: Poi[] = [
  { id: "seat", name: "Your Seat · 232-14-8", category: "seat", x: 470, y: 130 },
  { id: "r1", name: "Restroom North", category: "restroom", x: 300, y: 60 },
  { id: "r2", name: "Restroom South", category: "restroom", x: 300, y: 340 },
  { id: "r3", name: "Restroom East", category: "restroom", x: 520, y: 200 },
  { id: "f1", name: "Food Court · Global Eats", category: "food", x: 120, y: 100 },
  { id: "f2", name: "Food Court · Latin Grill", category: "food", x: 120, y: 300 },
  { id: "f3", name: "Snack Bar East", category: "food", x: 500, y: 260 },
  { id: "m1", name: "Medical Center", category: "medical", x: 200, y: 200 },
  { id: "p1", name: "Prayer Room", category: "prayer", x: 400, y: 60 },
  { id: "c1", name: "Charging Station A", category: "charging", x: 350, y: 300 },
  { id: "mr1", name: "Merch · Home Kit", category: "merch", x: 90, y: 200 },
  { id: "w1", name: "Water Station", category: "water", x: 300, y: 200 },
  { id: "e1", name: "Exit · Gate A", category: "exit", x: 60, y: 60 },
  { id: "e2", name: "Exit · Gate B", category: "exit", x: 60, y: 340 },
  { id: "e3", name: "Exit · Gate C", category: "exit", x: 540, y: 60 },
  { id: "e4", name: "Exit · Gate D (Accessible)", category: "exit", x: 540, y: 340 },
  { id: "wc1", name: "Wheelchair Ramp", category: "wheelchair", x: 240, y: 340 },
  { id: "fam", name: "Family Zone", category: "family", x: 400, y: 340 },
];

export const CATEGORY_META: Record<
  PoiCategory,
  { label: string; color: string; emoji: string }
> = {
  seat: { label: "Your Seat", color: "#FFD84D", emoji: "🎟" },
  restroom: { label: "Restrooms", color: "#60A5FA", emoji: "🚻" },
  food: { label: "Food Courts", color: "#F97316", emoji: "🍔" },
  medical: { label: "Medical", color: "#EF4444", emoji: "➕" },
  prayer: { label: "Prayer Rooms", color: "#A78BFA", emoji: "🕌" },
  charging: { label: "Charging", color: "#22D3EE", emoji: "🔌" },
  merch: { label: "Merch", color: "#EC4899", emoji: "🛍" },
  water: { label: "Water", color: "#38BDF8", emoji: "💧" },
  exit: { label: "Emergency Exits", color: "#84CC16", emoji: "🚪" },
  wheelchair: { label: "Wheelchair Routes", color: "#14B8A6", emoji: "♿" },
  family: { label: "Family Zones", color: "#F472B6", emoji: "👨‍👩‍👧" },
};
